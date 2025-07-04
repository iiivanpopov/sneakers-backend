import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

import { UserRepository } from '../infrastructure/repositories/user.repository'

import configuration from '@/shared/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(configuration.KEY)
		private readonly config: ConfigType<typeof configuration>,
		private readonly userRepository: UserRepository
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.jwt.jwtAccessSecret
		})
	}

	async validate(payload: { sub: string }) {
		const user = await this.userRepository.findById(payload.sub)
		if (!user) throw new UnauthorizedException()

		return user
	}
}
