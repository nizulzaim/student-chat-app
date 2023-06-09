import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsResolver } from './auths.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        return {
          global: true,
          signOptions: { expiresIn: '60s' },
          verifyOptions: { ignoreExpiration: true },
          secret,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthsService, AuthsResolver],
})
export class AuthsModule {}
