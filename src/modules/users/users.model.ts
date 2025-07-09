import { BaseResponse } from '@/utils/services/base'
import { ApiProperty } from '@nestjs/swagger'

export class UserResponseDto {
  @ApiProperty({ example: 'ckv123abc', description: 'User ID' })
  id: string

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName: string | null

  @ApiProperty({
    example: 'Michael',
    description: 'Middle name',
    required: false
  })
  middleName: string | null

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName: string | null

  @ApiProperty({ example: 'USA', description: 'Country' })
  country: string | null

  @ApiProperty({ example: 'New York', description: 'City' })
  city: string | null

  @ApiProperty({ example: 'CUSTOMER', description: 'User role' })
  role: string
}

export class SessionResponse extends BaseResponse {
  @ApiProperty({ description: 'User', type: UserResponseDto })
  user: UserResponseDto
}

export class SignInResponse extends BaseResponse {
  @ApiProperty({ example: 'jwt.token.here', description: 'Access token' })
  accessToken: string
}

export class RefreshResponse extends BaseResponse {
  @ApiProperty({ example: 'jwt.token.here', description: 'Access token' })
  accessToken: string
}

export class UpdateProfileResponse extends BaseResponse {
  @ApiProperty({ description: 'User', type: UserResponseDto })
  user: UserResponseDto
}
