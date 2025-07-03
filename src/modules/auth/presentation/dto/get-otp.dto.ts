import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class GetOtpDto {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string
}
