import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, Min } from 'class-validator'

export class AddToCartDto {
  @ApiProperty()
  @IsString()
  stockId: string

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number
}
