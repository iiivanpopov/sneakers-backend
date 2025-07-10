import { ApiProperty } from '@nestjs/swagger'
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsDateString
} from 'class-validator'

export class UpdateDiscountDto {
  @ApiProperty({ description: 'Discount title/name', required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ description: 'Fixed discount amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number

  @ApiProperty({ description: 'Percentage discount (0-100)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
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
