import { IS_PUBLIC_KEY } from '@libs/decorators';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-core';
import { UsersService } from 'src/users/users.service';
import {
  Algorithm,
  JwtHeader,
  SigningKeyCallback,
  verify as jwtVerify,
} from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const targets = [context.getHandler(), context.getClass()];
    const request = ctx.getContext().req;

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    );

    if (isPublic) {
      return true;
    }

    const authToken: string = request.headers.authorization;
    if (!authToken?.startsWith('Bearer'))
      throw new AuthenticationError('Invalid token');

    const token = authToken.substring(6).trim();
    try {
      const payload = await this.validateToken<{ preferred_username: string }>(
        token,
      );

      const user = await this.userService.findOne({
        email: payload.preferred_username,
      });

      request.user = user;
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }

  async validateToken<T>(idToken: string): Promise<T> {
    const clientId = this.configService.get('AZURE_CLIENTID');
    const tenantId = this.configService.get('AZURE_TENANTID');

    const options = {
      algorithms: ['RS256'] as Algorithm[],
      issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      audience: clientId,
    };
    return new Promise<T>((resolve, reject) => {
      jwtVerify(idToken, this.getPublicKey, options, (err, decoded) => {
        if (err) reject(err);

        resolve(decoded as T);
      });
    });
  }

  getPublicKey(header: JwtHeader, callback: SigningKeyCallback) {
    const tenantId = process.env.AZURE_TENANTID;

    const client = jwksClient({
      jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
    });
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
      } else {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      }
    });
  }
}
