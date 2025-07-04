import { NotFoundException } from '@nestjs/common'

export class SneakerModelNotFound extends NotFoundException {
	constructor(message: string = 'Sneaker model not found') {
		super(message)
	}
}
