import { BadRequestException } from '@nestjs/common'

export class MultipleUsers extends BadRequestException {
	constructor(message = 'Multiple users found, use email') {
		super(message)
	}
}
