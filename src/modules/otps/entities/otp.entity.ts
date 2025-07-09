import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'

export class OtpEntity {
  @ApiProperty({ example: 'test@gmail.com', description: 'Email' })
  @IsString()
  email: string

  @ApiProperty({ example: 650231, description: 'OTP code' })
  @IsNumber()
  code: number

  @ApiProperty({ example: 1752002446737, description: 'Unix timestamp' })
  @IsNumber()
  retryAt: number
}

type RedisOtpRaw = Record<string, string>
export function mapToOtpEntity(raw: RedisOtpRaw): OtpEntity {
  return {
    email: raw.email,
    code: Number(raw.code),
    retryAt: Number(raw.retryAt)
  }
}
