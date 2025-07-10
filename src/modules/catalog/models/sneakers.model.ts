import { BaseResponse } from '@/utils/services/base'
import { ApiProperty } from '@nestjs/swagger'
import { SneakerDetails } from '../entities/sneaker.entity'

export class SneakersListResponse extends BaseResponse {
  @ApiProperty({ type: [SneakerDetails] })
  data: SneakerDetails[]
}

export class SneakersSearchResponse extends BaseResponse {
  @ApiProperty({ type: [SneakerDetails] })
  data: SneakerDetails[]
}

export class SneakerDetailsResponse extends BaseResponse {
  @ApiProperty({ type: SneakerDetails })
  data: SneakerDetails
}

export class CreateSneakerResponse extends BaseResponse {
  @ApiProperty({ type: SneakerDetails })
  data: SneakerDetails
}
