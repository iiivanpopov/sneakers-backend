import { BadRequestException } from '@nestjs/common'

export class UserAlreadyExists extends BadRequestException {
	constructor(message = 'User already exists') {
		super(message)
	}
}
