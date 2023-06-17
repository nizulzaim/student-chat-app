import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReadStream } from 'fs';
import * as AWS from 'aws-sdk';
import { Attachment } from './entities/attachment.entity';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '@libs/databases';
import { FileUpload } from './interfaces/file-upload';

@Injectable()
export class AttachmentsService {
  private endpoint = this.configService.get<string>('S3_ENDPOINT');
  private mainfolder = this.configService.get<string>('S3_MAIN_FOLDER');
  private bucket = this.configService.get<string>('S3_BUCKET');
  private s3 = new AWS.S3({
    endpoint: this.endpoint,
    accessKeyId: this.configService.get<string>('S3_ACCESSKEY'),
    secretAccessKey: this.configService.get<string>('S3_SECRETKEY'),
    httpOptions: { timeout: 10 * 60 * 1000 },
  });

  constructor(
    private configService: ConfigService,
    private readonly attachment: DatabaseService<Attachment>,
  ) {
    this.attachment.setCollection(Attachment);
  }

  async upload(
    file: FileUpload,
    publicAccess = true,
  ) {
      const id = new ObjectId();
      const upload = await this.uploadReadableStream(
        file.createReadStream(),
        id.toString(),
        file.filename,
        file.mimetype,
        publicAccess,
      );

      return await this.attachment.create(
        {
          _id: new ObjectId(id),
          filename: file.filename,
          mimeType: file.mimetype,
          key: `${id}/${file.filename}`,
          size: await this.sizeOf(upload.Key),
          isPublic: publicAccess,
          isActive: true
        },
      );

  }

  async getUrl(id: ObjectId | string, { downloadable = false } = {}) {
    const attachment = await this.attachment.findOne({ _id: new ObjectId(id) });

    if (attachment?.isPublic) {
      return `${this.endpoint}/${this.bucket}/${this.mainfolder}/${attachment.key}`;
    }

    return this.getSignedUrl(attachment, downloadable);
  }

  async getByFilename(filename: string, isPublic = true) {
    return this.attachment.findOne({ filename, isPublic });
  }

  async getById(_id: ObjectId) {
    return this.attachment.findOne({_id})
  }

  async getSignedUrl(attachment: Attachment, downloadable = false) {
    const Key = attachment.key;
    const contentDispositionType = downloadable ? 'attachment' : 'inline';

    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get<string>('S3_BUCKET'),
      Expires: 60 * 60,
      Key: this.mainfolder + '/' + Key,
      ResponseContentDisposition: `${contentDispositionType}; filename="${attachment.filename}"`,
    });
  }

  private async uploadReadableStream(
    stream: ReadStream,
    folder: string,
    filename: string,
    mimeType: string,
    publicAccess = true,
  ) {
    const params = {
      Bucket: this.configService.get<string>('S3_BUCKET'),
      Key: `${this.mainfolder}/${folder}/${filename}`,
      Body: stream,
      partSize: 5 * 1024 * 1024,
      queueSize: 10,
      ContentType: mimeType,
      ResponseContentDisposition: `inline; filename="${filename}"`,
    };
    return this.s3
      .upload({ ...params, ACL: publicAccess ? 'public-read' : undefined })
      .promise();
  }

  async sizeOf(key: string) {
    const head = await this.s3
      .headObject({
        Key: key,
        Bucket: this.configService.get<string>('S3_BUCKET'),
      })
      .promise();

    if (head && head.ContentLength) return head.ContentLength;

    return 0;
  }
}
