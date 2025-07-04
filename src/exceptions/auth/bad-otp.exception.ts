import { UnauthorizedException } from '@nestjs/common'

export class BadOTP extends UnauthorizedException {
	constructor(message = 'Bad otp code') {
		super(message)
	}
}
