import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class UpdateCartDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number
}
