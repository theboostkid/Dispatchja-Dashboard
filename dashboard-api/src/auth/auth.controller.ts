import {
  Controller,
  Request,
  Param,
  Post,
  Patch,
  UseGuards,
  HttpCode,
  Headers,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/log-in')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    const user = req.user as User;

    const payload = {
      userId: user.id,
      role: user.role,
      merchantName: user.merchantName,
    };
    const { token, tokenInCookie } = this.authService.getJwtCookie(payload);

    req.res.setHeader('Set-Cookie', [tokenInCookie]);

    return {
      token,
      user,
    };
  }

  @Post('/log-out/:id')
  @HttpCode(204)
  async logout(@Param('id') id: string, @Request() req) {
    await this.authService.logOut(id);

    req.res.setHeader('Set-Cookie', ['AccessToken=; HttpOnly;  Max-Age=0']);
  }

  @Post('/:email/request-password-change')
  @HttpCode(204)
  requestPasswordChange(
    @Param('email') email: string,
    @Headers() headers: any,
  ) {
    const origin = headers.origin || headers.host;
    return this.authService.sendResetPasswordRequest(email, origin);
  }

  @Patch('/confirm-password-change/:token')
  @HttpCode(204)
  confirmPasswordChange(@Param('token', ParseUUIDPipe) token: string) {
    return this.authService.sentNewPassword(token);
  }
}
