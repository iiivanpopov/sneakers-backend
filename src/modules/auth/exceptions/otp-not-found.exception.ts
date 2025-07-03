import { NotFoundException } from '@nestjs/common'

export class OtpNotFound extends NotFoundException {
	constructor(message = 'Otp not found') {
		super(message)
	}
}
