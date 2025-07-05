import { Injectable } from '@nestjs/common'

import { AddCartItemDTO } from '../dto/add-cart-item.dto'
import { UpdateCartItemDTO } from '../dto/update-cart-item.dto'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class CartRepository {
	constructor(private readonly prisma: PrismaService) {}

	async existsById(cartItemId: string) {
		const item = await this.prisma.cartItem.findFirst({
			where: { id: cartItemId }
		})
		return !!item
	}

	async existsBySneakerId(sneakerId: string) {
		const item = await this.prisma.cartItem.findFirst({
			where: { sneakerId: sneakerId }
		})
		return !!item
	}

	async createCart(userId: string) {
		return this.prisma.cart.create({
			data: { userId }
		})
	}

	async getCart(userId: string) {
		return this.prisma.cart.findFirst({
			where: { userId },
			select: { items: true }
		})
	}

	async addByUserId(userId: string, item: AddCartItemDTO) {
		const cart = await this.prisma.cart.findFirst({
			where: { userId }
		})

		return this.prisma.cartItem.create({
			data: { cartId: cart.id, ...item },
			include: {
				sneaker: {
					select: {
						sneakerModel: {
							select: {
								slug: true
							}
						}
					}
				}
			}
		})
	}

	async remove(userId: string, itemId: string) {
		return this.prisma.cartItem.delete({
			where: { id: itemId, cart: { userId } }
		})
	}

	async update(userId: string, itemId: string, item: UpdateCartItemDTO) {
		return this.prisma.cartItem.update({
			where: {
				id: itemId,
				cart: { userId }
			},
			data: item
		})
	}

	async clearCart(userId: string) {
		return this.prisma.cartItem.deleteMany({
			where: { cart: { userId: { equals: userId } } }
		})
	}
}
