import { BadRequestException } from '@nestjs/common'

export class ReviewAlreadyExists extends BadRequestException {
	constructor(message: string = 'Review already exists') {
		super(message)
	}
}
