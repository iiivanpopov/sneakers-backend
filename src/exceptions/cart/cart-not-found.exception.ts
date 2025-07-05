import { NotFoundException } from '@nestjs/common'

export class CartNotFound extends NotFoundException {
	constructor(message = 'Cart not found') {
		super(message)
	}
}
