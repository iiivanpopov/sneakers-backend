import { BaseResponse } from '@/utils/services/base'
import { ApiProperty } from '@nestjs/swagger'
import { SneakerDetails } from '../entities/sneaker.entity'

export class PopularSneakersResponse extends BaseResponse {
  @ApiProperty({ type: [SneakerDetails] })
  data: SneakerDetails[]
}
