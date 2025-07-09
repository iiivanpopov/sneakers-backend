import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

class UpdateProfileDataDto {
  @ApiProperty({ example: 'John', description: 'First name', required: false })
  @IsString()
  @IsOptional()
  firstName?: string

  @ApiProperty({
    example: 'Middle',
    description: 'Middle name',
    required: false
  })
  @IsString()
  @IsOptional()
  middleName?: string

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  @IsString()
  @IsOptional()
  lastName?: string

  @ApiProperty({
    example: 'email@example.com',
    description: 'Email',
    required: false
  })
  @IsString()
  @IsOptional()
  email?: string

  @ApiProperty({ example: 'New York', description: 'City', required: false })
  @IsString()
  @IsOptional()
  city?: string

  @ApiProperty({ example: 'USA', description: 'Country', required: false })
  @IsString()
  @IsOptional()
  country?: string
}

export class UpdateProfileDto {
  @ApiProperty({ description: 'Profile data' })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateProfileDataDto)
  profile: UpdateProfileDataDto

  @ApiProperty({ example: 'test@gmail.com', description: 'Email' })
  @IsString()
  @IsNotEmpty()
  email: string
}
