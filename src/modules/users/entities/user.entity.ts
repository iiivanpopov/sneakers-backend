import { User } from '@/prisma'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsEnum } from 'class-validator'

export const Role = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN'
} as const
export type Role = (typeof Role)[keyof typeof Role]

export class UserEntity {
  @ApiProperty({ example: 'ckv39hsm70000u8f5rbj1syt1', description: 'User ID' })
  @IsString()
  id: string

  @ApiProperty({ example: 'email@example.com', description: 'Email address' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Middle', description: 'Middle name' })
  @IsString()
  middleName: string

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string

  @ApiProperty({ example: 'USA', description: 'Country' })
  @IsString()
  country: string

  @ApiProperty({ example: 'New York', description: 'City' })
  @IsString()
  city: string

  @ApiProperty({ enum: Role, example: Role.CUSTOMER })
  @IsEnum(Role)
  role: Role
}

export const mapToUserEntity = (user: User): UserEntity => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName!,
  middleName: user.middleName!,
  lastName: user.lastName!,
  country: user.country!,
  city: user.city!,
  role: user.role
})
