import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDateString,
  ValidateIf,
  IsNotEmpty
} from 'class-validator'
import { Transform } from 'class-transformer'
import { DISCOUNT_CONSTANTS } from '../constants/discount.constants'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDiscountDto {
  @ApiProperty({ description: 'Discount title/name' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: 'Fixed discount amount', required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(DISCOUNT_CONSTANTS.MIN_AMOUNT)
  @ValidateIf(o => !o.percent)
  @Transform(({ value }) => parseFloat(value))
  amount?: number

  @ApiProperty({ description: 'Percentage discount (0-100)', required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(DISCOUNT_CONSTANTS.MIN_PERCENT)
  @Max(DISCOUNT_CONSTANTS.MAX_PERCENT)
  @ValidateIf(o => !o.amount)
  @Transform(({ value }) => parseFloat(value))
  percent?: number

  @ApiProperty({
    description: 'Discount start date (ISO string)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startsAt?: string

  @ApiProperty({
    description: 'Discount end date (ISO string)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endsAt?: string
}
