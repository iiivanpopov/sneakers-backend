import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class GetOTPDto {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string
}
