import { UnauthorizedException } from '@nestjs/common'

export class MissingRefreshToken extends UnauthorizedException {
	constructor(message = 'Missing refresh token') {
		super(message)
	}
}
