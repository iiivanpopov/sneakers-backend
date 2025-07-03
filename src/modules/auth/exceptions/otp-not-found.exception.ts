import { NotFoundException } from '@nestjs/common'

export class OTPNotFound extends NotFoundException {
	constructor(message = 'OTP not found') {
		super(message)
	}
}
