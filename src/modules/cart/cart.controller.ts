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
import { CartListResponse } from './cart.model'
import { AddToCartDto } from './dto/add-to-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { Request } from 'express'
import { BaseResolver, BaseResponse } from '@/utils/services/base'
import { mapToSneakerDetails } from '../catalog/utils/mappers/mapToSneakerDetails'
import { SneakerDetails } from '../catalog/entities/sneaker.entity'
import { FavoritesService } from '@/modules/favorites/favorites.service'

@ApiTags('Cart')
@Controller('cart')
@UseAuthGuard()
export class CartController extends BaseResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly favoritesService: FavoritesService
  ) {
    super()
  }

  private async getUserFavorites(userId: string): Promise<string[]> {
    const favorites = await this.favoritesService.findMany({
      where: { userId },
      select: { sneakerId: true }
    })
    return favorites.map(fav => fav.sneakerId)
  }

  @Get()
  @ApiOperation({ summary: 'Get cart items' })
  @ApiResponse({ type: CartListResponse })
  async getCart(@Req() req: Request): Promise<CartListResponse> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException()

    const cartItems = await this.cartService.findMany({
      where: { userId },
      include: {
        stock: {
          include: {
            sneaker: {
              include: {
                brand: true,
                popularity: true,
                discount: true
              }
            }
          }
        }
      }
    })

    const userFavoredIds = await this.getUserFavorites(userId)

    const mappedCartItems: SneakerDetails[] = cartItems.map(c =>
      mapToSneakerDetails({
        ...c.stock.sneaker,
        isFavored: userFavoredIds.includes(c.stock.sneaker.id)
      })
    )

    return this.wrapSuccess({ data: mappedCartItems })
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ type: SneakerDetails })
  async addItem(
    @Body() dto: AddToCartDto,
    @Req() req: Request
  ): Promise<SneakerDetails> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException()

    const cartItem = await this.cartService.create({
      data: { ...dto, userId },
      include: {
        stock: {
          include: {
            sneaker: {
              include: {
                brand: true,
                popularity: true,
                discount: true
              }
            }
          }
        }
      }
    })

    const userFavoredIds = await this.getUserFavorites(userId)

    return this.wrapSuccess(
      mapToSneakerDetails({
        ...cartItem.stock.sneaker,
        isFavored: userFavoredIds.includes(cartItem.stock.sneaker.id)
      })
    )
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiResponse({ type: SneakerDetails })
  async updateItem(
    @Param('slug') slug: string,
    @Body() dto: UpdateCartDto,
    @Req() req: Request
  ): Promise<SneakerDetails> {
    const userId = req.user?.id
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
            sneaker: {
              include: {
                brand: true,
                popularity: true,
                discount: true
              }
            }
          }
        }
      }
    })

    const userFavoredIds = await this.getUserFavorites(userId)

    return this.wrapSuccess(
      mapToSneakerDetails({
        ...cartItem.stock.sneaker,
        isFavored: userFavoredIds.includes(cartItem.stock.sneaker.id)
      })
    )
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Remove item from cart by slug' })
  async removeItem(
    @Param('slug') slug: string,
    @Req() req: Request
  ): Promise<BaseResponse> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException()

    const cartItem = await this.cartService.findFirst({
      where: {
        userId,
        stock: {
          sneaker: {
            slug
          }
        }
      }
    })

    if (!cartItem) throw new NotFoundException('Cart item not found')

    await this.cartService.delete({
      where: {
        userId_stockId: {
          userId,
          stockId: cartItem.stockId
        }
      }
    })

    return this.wrapSuccess()
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  async clearCart(@Req() req: Request): Promise<BaseResponse> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException()

    await this.cartService.deleteMany({ where: { userId } })

    return this.wrapSuccess()
  }
}
