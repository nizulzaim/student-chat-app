import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthsService } from './auths.service';
import { LoginWithPasswordInput } from './dto/input';
import { LoginWithPasswordOutput } from './dto/output';
import { Public } from '@libs/decorators';

@Resolver()
export class AuthsResolver {
  constructor(private readonly authService: AuthsService) {}

  @Mutation(() => LoginWithPasswordOutput)
  @Public()
  loginWithPassword(@Args('input') input: LoginWithPasswordInput) {
    return this.authService.loginWithPassword(input);
  }
}
