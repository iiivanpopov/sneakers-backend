import { Type } from 'class-transformer'
import { IsString, IsEmail, ValidateNested, IsNotEmpty } from 'class-validator'

class UserDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	phone: string
}

export class RegisterDto {
	@ValidateNested()
	@Type(() => UserDto)
	user: UserDto

	@IsString()
	otp: string
}
