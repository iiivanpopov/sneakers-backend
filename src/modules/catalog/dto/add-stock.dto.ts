import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive, Min } from 'class-validator'

export class AddStockDto {
  @ApiProperty({ example: 10.5, description: 'Shoe size' })
  @IsNumber()
  @IsPositive()
  size: number

  @ApiProperty({ example: 25, description: 'Quantity to add' })
  @IsNumber()
  @Min(1)
  quantity: number
}
