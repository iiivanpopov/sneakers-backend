import { NotFoundException } from '@nestjs/common'

export class UserNotFound extends NotFoundException {
	constructor(message: string = 'User not found') {
		super(message)
	}
}
