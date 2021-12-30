import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.AccessToken;
			}]),
			ignoreExpiration: true,
			secretOrKey: configService.get<string>('JWT_SECRET'),
			passReqToCallback: true
		});
	}

	async validate(req, payload: any) {
		return { ID: payload.userId, role: payload.role, restaurantName: payload.restaurantName };
	}
}
