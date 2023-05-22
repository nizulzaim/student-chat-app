import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthsService } from './auths.service';
import { LoginWithPasswordInput } from './dto/input';
import { Public } from '@libs/decorators';
import { LoginResult } from './dto/output';

@Resolver()
export class AuthsResolver {
  constructor(private readonly authService: AuthsService) {}

  @Mutation(() => LoginResult)
  @Public()
  loginWithPassword(
    @Args('input') input: LoginWithPasswordInput,
  ): Promise<LoginResult> {
    return this.authService.loginWithPassword(input);
  }
}
