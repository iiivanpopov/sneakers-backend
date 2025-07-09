import { ApiProperty } from '@nestjs/swagger'
import { BaseResponse } from '@/utils/services/base'
import { Sneaker, Stock } from '@/prisma'

export class CartItem {
  @ApiProperty()
  sneakerId: string

  @ApiProperty()
  sneakerName: string

  @ApiProperty()
  quantity: number

  @ApiProperty({ type: [String] })
  images: string[]

  @ApiProperty()
  price: number
}

type CartItemWithRelations = Pick<CartItem, 'quantity'> & {
  stock: Stock & {
    sneaker: Sneaker
  }
}

export const mapToCartItemDto = (item: CartItemWithRelations): CartItem => ({
  sneakerId: item.stock.sneaker.id,
  sneakerName: item.stock.sneaker.name,
  quantity: item.quantity,
  images: item.stock.sneaker.images,
  price: item.stock.sneaker.price
})

export class CartListResponse extends BaseResponse {
  @ApiProperty({ type: [CartItem] })
  data: CartItem[]
}
