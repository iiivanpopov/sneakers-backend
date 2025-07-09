import { ApiProperty } from '@nestjs/swagger'
import { BaseResponse } from '@/utils/services/base'

export class SneakerItem {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  price: number

  @ApiProperty()
  brandName: string

  @ApiProperty({ type: [String], example: ['https://cdn.com/image.jpg'] })
  images: string[]
}

export class SneakersListResponse extends BaseResponse {
  @ApiProperty({ type: [SneakerItem] })
  data: SneakerItem[]
}

export const mapToSneakerItem = <T extends SneakerItem>(sneaker: T) => ({
  brandName: sneaker.brandName,
  id: sneaker.id,
  images: sneaker.images,
  name: sneaker.name,
  price: sneaker.price,
  slug: sneaker.slug
})

export class SearchResult {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  brandName: string

  @ApiProperty()
  price: number

  @ApiProperty({ type: [String] })
  images: string[]
}

export const mapToSearchResult = <T extends SearchResult>(sneaker: T) => ({
  brandName: sneaker.brandName,
  id: sneaker.id,
  images: sneaker.images,
  name: sneaker.name,
  price: sneaker.price,
  slug: sneaker.slug
})

export class SneakersSearchResponse extends BaseResponse {
  @ApiProperty({ type: [SearchResult] })
  data: SearchResult[]
}

export class PopularSneaker {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  views: number

  @ApiProperty()
  purchases: number

  @ApiProperty({ type: [String] })
  images: string[]
}

export const mapToPopularSneaker = <T extends PopularSneaker>(
  sneaker: T
): PopularSneaker => ({
  id: sneaker.id,
  images: sneaker.images,
  name: sneaker.name,
  slug: sneaker.slug,
  views: sneaker.views,
  purchases: sneaker.purchases
})

export class PopularSneakersResponse extends BaseResponse {
  @ApiProperty({ type: [PopularSneaker] })
  data: PopularSneaker[]
}

export class BrandItem {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export const mapToBrand = <T extends BrandItem>(brand: T): BrandItem => ({
  id: brand.id,
  name: brand.name
})

export class BrandsResponse extends BaseResponse {
  @ApiProperty({ type: [BrandItem] })
  data: BrandItem[]
}

export class SneakerDetails {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  price: number

  @ApiProperty()
  brandName: string

  @ApiProperty({ type: [String] })
  images: string[]
}

export const mapToSneakerDetails = <T extends SneakerDetails>(
  sneaker: T
): SneakerDetails => ({
  id: sneaker.id,
  images: sneaker.images,
  name: sneaker.name,
  slug: sneaker.slug,
  description: sneaker.description,
  price: sneaker.price,
  brandName: sneaker.brandName
})

export class SneakerDetailsResponse extends BaseResponse {
  @ApiProperty({ type: SneakerDetails })
  data: SneakerDetails
}

export class StockItem {
  @ApiProperty()
  size: number

  @ApiProperty()
  quantity: number
}

export const mapToStockItem = <T extends StockItem>(item: T): StockItem => ({
  size: item.size,
  quantity: item.quantity
})

export class SneakerStockResponse extends BaseResponse {
  @ApiProperty({ type: [StockItem] })
  data: StockItem[]
}
