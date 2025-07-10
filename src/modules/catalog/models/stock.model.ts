import { BaseResponse } from '@/utils/services/base'
import { ApiProperty } from '@nestjs/swagger'
import { Stock } from '@/prisma'

class StockItem implements Stock {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  sneakerId: string

  @ApiProperty({ type: Number })
  size: number

  @ApiProperty({ type: Number })
  quantity: number

  @ApiProperty({ type: String })
  createdAt: Date

  @ApiProperty({ type: String })
  updatedAt: Date
}

export class SneakerStockResponse extends BaseResponse {
  @ApiProperty({ type: [StockItem] })
  data: Stock[]
}

export class AddStockResponse extends BaseResponse {
  @ApiProperty({ type: StockItem })
  data: Stock
}
