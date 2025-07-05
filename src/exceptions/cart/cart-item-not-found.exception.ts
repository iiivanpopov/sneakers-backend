import { NotFoundException } from '@nestjs/common'

export class CartItemNotFound extends NotFoundException {
	constructor(message = 'Cart not found') {
		super(message)
	}
}
