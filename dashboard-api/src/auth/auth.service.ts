import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './tokenPayload.interface';
import { UsersService } from 'src/users/users.service';
import { User } from '../users/schema/user.schema'
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { generate } from 'generate-password';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly emailService: EmailService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService) { }

	public async getAuthenticatedUser(email: string, password: string): Promise<User> {
		const user = await this.usersService.findByEmail(email);
		if (!user || user.isDeleted) {
			throw new UnauthorizedException("Incorrect Credentials");
		}

		if (!user.isActive) {
			throw new UnauthorizedException("Account Disabled");
		}

		const isMatch = await this.verifyHash(password, user.password)
		if (!isMatch) {
			user.loginAttempts += 1;

			const threshold = this.configService.get<number>("LOGIN_ATTEMPT_THRESHOLD");
			if (user.loginAttempts > threshold) {
				await this.usersService.disableUser(user.id);

				this.emailService.sendEmail({
					to: user.email,
					subject: 'Account Disabled',
					template: './account-disabled',
					context: {
						name: user.name,
					},
				})

				throw new UnauthorizedException("Account Disabled");
			}

			await this.usersService.updateUserAttempts(user.id, user.loginAttempts)
			throw new UnauthorizedException("Incorrect Credentials");
		}

		const now = new Date();
		await this.usersService.updateLastLogInDate(user.id, now.toISOString());

		return this.usersService.removeSensitiveFields(user);
	}

	public async sendResetPasswordRequest(email: string, host: string) {
		const user = await this.usersService.findByEmail(email);
		if (!user || user.isDeleted || !user.isActive) {
			return;
		}

		const token = uuidv4();
		await this.usersService.updateUser(user.id, { resetPasswordToken: token })

		this.emailService.sendEmail({
			to: user.email,
			subject: 'Password Reset Request',
			template: './password-reset-request',
			context: {
				name: user.name,
				url: `${host}/confirm-request?token=${token}`,
			},
		})
	}

	public async sentNewPassword(resetPasswordToken: string) {
		const user = await this.usersService.findUserByResetToken(resetPasswordToken);
		if (!user || user.isDeleted || !user.isActive) {
			new NotFoundException();
		}

		const password = generate({ length: 10, numbers: true });
		
		await this.usersService.changePassword(user.id, password, true);

		this.emailService.sendEmail({
			to: user.email,
			subject: 'Password Reset',
			template: './password-reset',
			context: {
				password,
				name: user.name,
			},
		})
	}

	public getJwtToken(payloadData: any, expiresIn: string | number): string {
		const payload: TokenPayload = payloadData;
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get("JWT_SECRET"),
			expiresIn: expiresIn
		});

		return token;
	}

	public getJwtCookie(payload: any): { token: string, tokenInCookie: string } {
		const now = new Date();
		const expiryDate = new Date();
		const hourOfDay = this.configService.get<number>("JWT_ACCESS_TOKEN_EXPIRATION_HOUR");
		expiryDate.setDate(expiryDate.getDate() + 1);
		expiryDate.setHours(hourOfDay);

		const expiresIn = (expiryDate.getTime() - now.getTime()) / 1000;
		const token = this.getJwtToken(payload, expiresIn)

		return { token, tokenInCookie: `AccessToken=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}` };
	}

	private async verifyHash(plainTextPassword: string, hashedPassword: string): Promise<Boolean> {
		const isPasswordMatching = await bcrypt.compare(
			plainTextPassword,
			hashedPassword
		);

		return isPasswordMatching
	}

	public logOut(id: string): Promise<User> {
		const now = new Date();
		return this.usersService.updateLastLogOutDate(id, now.toISOString())
	}
}

