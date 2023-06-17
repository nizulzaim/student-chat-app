import { ObjectId } from 'mongodb';

export class CreateAttachment {
  _id: ObjectId;
  filename: string;
  mimeType: string;
  key: string;
  size: number;
  isPublic: boolean;
}
