import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common'

import { AddCartItemDTO } from '../dto/add-cart-item.dto'
import { UpdateCartItemDTO } from '../dto/update-cart-item.dto'
import { CartService } from '../services/cart.service'

import { User } from '@/auth/domain/entities/User'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/token/jwt/jwt.guard'

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get()
	async getCart(@CurrentUser() user: User) {
		const cart = await this.cartService.getCart(user.id)

		return { cart: cart.items, message: 'Fetched cart successfully' }
	}

	@Post()
	async addToCart(@CurrentUser() user: User, @Body() body: AddCartItemDTO) {
		await this.cartService.addToCart(user.id, body)

		return { message: 'Successfully added item to cart', success: true }
	}

	@Delete()
	async clearCart(@CurrentUser() user: User) {
		await this.cartService.clearCart(user.id)

		return { message: 'Successfully cleared cart', success: true }
	}

	@Delete(':id')
	async removeFromCart(@CurrentUser() user: User, @Param('id') id: string) {
		await this.cartService.removeFromCart(user.id, id)

		return { message: 'Successfully removed item from cart', success: true }
	}

	@Patch(':id')
	async updateSneakerInCart(
		@CurrentUser() user: User,
		@Param('id') id: string,
		@Body() body: UpdateCartItemDTO
	) {
		const cartItem = await this.cartService.updateSneakerInCart(
			user.id,
			id,
			body
		)

		return {
			item: cartItem,
			message: 'Successfully updated cart item',
			success: true
		}
	}
}
