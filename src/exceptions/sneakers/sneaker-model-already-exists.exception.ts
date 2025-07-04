import { BadRequestException } from '@nestjs/common'

export class SneakerModelAlreadyExists extends BadRequestException {
	constructor(message: string = 'Sneaker model already exists') {
		super(message)
	}
}
