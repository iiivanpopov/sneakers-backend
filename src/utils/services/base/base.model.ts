import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class BaseResponse {
  @IsBoolean()
  @ApiProperty({ description: 'Request status' })
  success!: boolean

  @IsString()
  @ApiProperty({
    description: 'Error reason',
    nullable: true,
    required: false
  })
  reason?: string
}
