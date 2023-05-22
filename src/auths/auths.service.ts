import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResult } from './dto/output';

@Injectable()
export class AuthsService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    const user = await this.userService.findOne({ email });

    if (!user) throw new Error('Email or password is incorrect');
    if (!user.isActive)
      throw new Error('User is not active. Please contact administrator');

    const isCorrect = await argon2.verify(user.password, password);
    if (!isCorrect) throw new Error('Email or password is incorrect');

    return {
      token: await this.generateToken(user),
      user,
    };
  }

  generateToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.signAsync(payload);
  }
}
