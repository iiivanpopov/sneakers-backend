import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordDTO {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	otp: string

	@IsString()
	@IsNotEmpty()
	password: string
}
