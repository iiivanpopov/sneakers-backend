import { Injectable } from '@nestjs/common'

import { AddCartItemDTO } from '../dto/add-cart-item.dto'
import { UpdateCartItemDTO } from '../dto/update-cart-item.dto'
import { CartRepository } from '../repositories/cart.repository'

import { CartItemExists } from '@/exceptions/cart/cart-item-exists.exception'
import { CartItemNotFound } from '@/exceptions/cart/cart-item-not-found.exception'
import { CartNotFound } from '@/exceptions/cart/cart-not-found.exception'

@Injectable()
export class CartService {
	constructor(private readonly cartRepository: CartRepository) {}

	async getCart(userId: string) {
		const cart = await this.cartRepository.getCart(userId)
		if (!cart) throw new CartNotFound()
		return cart
	}

	async addToCart(userId: string, dto: AddCartItemDTO) {
		const cart = await this.cartRepository.getCart(userId)
		if (!cart) throw new CartNotFound()

		const exists = await this.cartRepository.existsBySneakerId(dto.sneakerId)
		if (exists) throw new CartItemExists()

		await this.cartRepository.addByUserId(userId, dto)
	}

	async clearCart(userId: string) {
		const cart = await this.cartRepository.getCart(userId)
		if (!cart) throw new CartNotFound()

		await this.cartRepository.clearCart(userId)
	}

	async removeFromCart(userId: string, cartItemId: string) {
		const cart = await this.cartRepository.getCart(userId)
		if (!cart) throw new CartNotFound()

		const exists = await this.cartRepository.existsById(cartItemId)
		if (!exists) throw new CartItemNotFound()

		await this.cartRepository.remove(userId, cartItemId)
	}

	async updateSneakerInCart(
		userId: string,
		cartItemId: string,
		dto: UpdateCartItemDTO
	) {
		const cart = await this.cartRepository.getCart(userId)
		if (!cart) throw new CartNotFound()

		const exists = await this.cartRepository.existsById(cartItemId)
		if (!exists) throw new CartItemNotFound()

		const cartItem = await this.cartRepository.update(userId, cartItemId, dto)
		return cartItem
	}
}
