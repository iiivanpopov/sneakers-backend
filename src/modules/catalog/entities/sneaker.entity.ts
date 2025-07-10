import { ApiProperty } from '@nestjs/swagger'

export class SneakerDetails {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty({ type: String, nullable: true })
  description: string | null

  @ApiProperty()
  price: number

  @ApiProperty({ type: [String] })
  images: string[]

  @ApiProperty({ type: String })
  brandName: string

  @ApiProperty()
  views: number

  @ApiProperty()
  purchases: number

  @ApiProperty()
  finalPrice: number

  @ApiProperty()
  hasActiveDiscount: boolean

  @ApiProperty({ required: false, nullable: true })
  discountSavings?: number

  constructor(params: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    images: string[]
    views: number
    purchases: number
    brandName: string
    finalPrice: number
    hasActiveDiscount: boolean
    discountSavings?: number
  }) {
    Object.assign(this, params)
  }
}
