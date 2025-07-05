import { NotFoundException } from '@nestjs/common'

export class ReviewNotFound extends NotFoundException {
	constructor(message: string = 'Review not found') {
		super(message)
	}
}
