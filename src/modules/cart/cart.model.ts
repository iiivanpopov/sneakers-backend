import { ApiProperty } from '@nestjs/swagger'
import { BaseResponse } from '@/utils/services/base'
import { SneakerDetails } from '../catalog/entities/sneaker.entity'
export class CartListResponse extends BaseResponse {
  @ApiProperty({ type: [SneakerDetails] })
  data: SneakerDetails[]
}
