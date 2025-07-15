import { BaseResponse } from '@/utils/services/base'
import { ApiProperty } from '@nestjs/swagger'
import { SneakerDetails } from '../catalog/entities/sneaker.entity'

export class GetFavoritesResponse extends BaseResponse {
  @ApiProperty({ type: [SneakerDetails] })
  data: SneakerDetails[]
}
export class AddToFavoriteResponse extends BaseResponse {}
export class RemoveFromFavoriteResponse extends BaseResponse {}
