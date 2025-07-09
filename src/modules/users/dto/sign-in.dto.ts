import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class SignInDto {
  @ApiProperty({ example: 'test@gmail.com', description: 'Email' })
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: 345231, description: 'OTP code' })
  @IsNumber()
  @IsNotEmpty()
  code: number
}
