import { Brand } from '@/prisma'
import { BaseResponse } from '@/utils/services/base'
import { ApiProperty } from '@nestjs/swagger'

export class BrandItem implements Brand {
  @ApiProperty()
  name: string

  @ApiProperty()
  id: string

  @ApiProperty({ type: String, nullable: true })
  logo: string | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class BrandsResponse extends BaseResponse {
  @ApiProperty({ type: [BrandItem] })
  data: Brand[]
}
