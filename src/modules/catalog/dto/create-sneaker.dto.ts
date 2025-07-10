import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsArray
} from 'class-validator'

export class CreateSneakerDto {
  @ApiProperty({ example: 'Air Jordan 1 Retro High' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'air-jordan-1-retro-high' })
  @IsString()
  @IsNotEmpty()
  slug: string

  @ApiProperty({
    example: 'Classic basketball shoe with timeless design',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ example: 170, description: 'Price in USD' })
  @IsNumber()
  @IsPositive()
  price: number

  @ApiProperty({ example: 'Nike' })
  @IsString()
  @IsNotEmpty()
  brandName: string

  @ApiProperty({ example: 'https://cdn.com/image1.jpg' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  brandLogoUrl?: string

  @ApiProperty({
    type: [String],
    example: ['https://cdn.com/image1.jpg', 'https://cdn.com/image2.jpg'],
    description: 'Array of image URLs'
  })
  @IsArray()
  @IsString({ each: true })
  images: string[]
}
