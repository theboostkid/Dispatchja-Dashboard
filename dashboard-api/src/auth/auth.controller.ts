import { Controller, Request, Body, Param, Post, Get, Patch, UseGuards, HttpCode, UnauthorizedException, HostParam } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';
import { IdOnlyParams, EmailOnlyParams } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }

  @Post("/log-in")
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    const user = req.user as User;

    const payload = { userId: user.id, role: user.role, restaurantName: user.restaurantName }
    const { token, tokenInCookie } = this.authService.getJwtCookie(payload);

    req.res.setHeader('Set-Cookie', [tokenInCookie])

    return {
      token,
      user
    }
  }

  @Post("/log-out/:id")
  @HttpCode(204)
  async logout(@Param("id") id: string, @Request() req) {
    await this.authService.logOut(id);

    req.res.setHeader('Set-Cookie', [
      'AccessToken=; HttpOnly;  Max-Age=0'
    ]);
  }

  @Post("/:email")
  @HttpCode(204)
  requestPasswordChange(@Param() { email }: EmailOnlyParams, @HostParam('origin') origin: string) {
    this.authService.sendResetPasswordRequest(email, origin)
  }

}
