import { BadRequestException } from '@nestjs/common'

export class SneakerAlreadyExists extends BadRequestException {
	constructor(message: string = 'Sneaker already exists') {
		super(message)
	}
}
