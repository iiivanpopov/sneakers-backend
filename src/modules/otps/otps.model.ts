import { BaseResponse } from '@/utils/services/base'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class OtpResponse extends BaseResponse {
  @ApiProperty({
    example: 1752002446737,
    description: 'Unix timestamp'
  })
  @IsNumber()
  retryAt: number
}
