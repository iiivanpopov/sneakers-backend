import { UseAuthGuard } from '@/utils/guards/auth.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  NotFoundException
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CartService } from './cart.service'
import { CartListResponse, CartItem, mapToCartItemDto } from './cart.model'
import { AddToCartDto } from './otp/add-to-cart.dto'
import { UpdateCartDto } from './otp/update-cart.dto'
import { Request } from 'express'
import { BaseResolver, BaseResponse } from '@/utils/services/base'

@ApiTags('Cart')
@Controller('cart')
@UseAuthGuard()
export class CartController extends BaseResolver {
  constructor(private readonly cartService: CartService) {
    super()
  }

  @Get()
  @ApiOperation({ summary: 'Get cart items' })
  @ApiResponse({ type: CartListResponse })
  async getCart(@Req() req: Request): Promise<CartListResponse> {
    const userId = req.user?.userId
    if (!userId) throw new UnauthorizedException()

    const cartItems = await this.cartService.findMany({
      where: { userId },
      include: {
        stock: {
          include: {
            sneaker: true
          }
        }
      }
    })

    const mappedCartItems: CartItem[] = cartItems.map(mapToCartItemDto)

    return this.wrapSuccess({ data: mappedCartItems })
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ type: CartItem })
  async addItem(
    @Body() dto: AddToCartDto,
    @Req() req: Request
  ): Promise<CartItem> {
    const userId = req.user?.userId
    if (!userId) throw new UnauthorizedException()

    const cartItem = await this.cartService.create({
      data: { ...dto, userId },
      include: {
        stock: {
          include: {
            sneaker: true
          }
        }
      }
    })

    return this.wrapSuccess(mapToCartItemDto(cartItem))
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiResponse({ type: CartItem })
  async updateItem(
    @Param('slug') slug: string,
    @Body() dto: UpdateCartDto,
    @Req() req: Request
  ): Promise<CartItem> {
    const userId = req.user?.userId
    if (!userId) throw new UnauthorizedException()

    const stock = await this.cartService.findFirst({
      where: {
        stock: {
          sneaker: {
            slug
          }
        }
      }
    })
    if (!stock) throw new NotFoundException('Stock item not found')

    const cartItem = await this.cartService.update({
      where: {
        userId_stockId: {
          userId,
          stockId: stock.id
        }
      },
      data: {
        quantity: dto.quantity
      },
      include: {
        stock: {
          include: {
            sneaker: true
          }
        }
      }
    })

    return this.wrapSuccess(mapToCartItemDto(cartItem))
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Remove item from cart by slug' })
  async removeItem(
    @Param('slug') slug: string,
    @Req() req: Request
  ): Promise<BaseResponse> {
    const userId = req.user?.userId
    if (!userId) throw new UnauthorizedException()

    const stock = await this.cartService.findFirst({
      where: {
        stock: {
          sneaker: {
            slug
          }
        }
      }
    })
    if (!stock) throw new NotFoundException('Stock item not found')

    await this.cartService.delete({
      where: {
        userId_stockId: {
          userId,
          stockId: stock.id
        }
      }
    })

    return this.wrapSuccess()
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  async clearCart(@Req() req: Request): Promise<BaseResponse> {
    const userId = req.user?.userId
    if (!userId) throw new UnauthorizedException()

    await this.cartService.deleteMany({ where: { userId } })

    return this.wrapSuccess()
  }
}
