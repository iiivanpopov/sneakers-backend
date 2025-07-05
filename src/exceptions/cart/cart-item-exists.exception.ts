import { NotFoundException } from '@nestjs/common'

export class CartItemExists extends NotFoundException {
	constructor(message = 'Cart item already exists') {
		super(message)
	}
}
