import { Type } from 'class-transformer'
import { IsString, IsEmail, ValidateNested, IsNotEmpty } from 'class-validator'

class UserDTO {
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

	@IsString()
	@IsNotEmpty()
	password: string
}

export class RegisterDto {
	@ValidateNested()
	@Type(() => UserDTO)
	user: UserDTO

	@IsString()
	otp: string
}
