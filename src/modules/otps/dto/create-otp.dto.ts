import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOtpDto {
  @ApiProperty({ example: 'test@gmail.com', description: 'Email' })
  @IsString()
  @IsNotEmpty()
  email: string
}
