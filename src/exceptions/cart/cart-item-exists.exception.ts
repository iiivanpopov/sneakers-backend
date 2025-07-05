import { BadRequestException } from '@nestjs/common'

export class CartItemExists extends BadRequestException {
	constructor(message = 'Cart item already exists') {
		super(message)
	}
}
