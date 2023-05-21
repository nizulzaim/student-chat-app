import { IS_PUBLIC_KEY } from '@libs/decorators';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
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

    const secret = this.configService.get<string>('JWT_SECRET');
    const authToken = request.headers.authorization;
    let token = '';

    if (!authToken) throw new AuthenticationError('Invalid token');
    if (authToken.substr(0, 6).toLowerCase() === 'bearer') {
      token = authToken.substr(6).trim();
    } else {
      throw new AuthenticationError('Invalid token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
