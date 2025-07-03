import { UnauthorizedException } from '@nestjs/common'

export class BadOtp extends UnauthorizedException {
	constructor(message = 'Bad otp code') {
		super(message)
	}
}
