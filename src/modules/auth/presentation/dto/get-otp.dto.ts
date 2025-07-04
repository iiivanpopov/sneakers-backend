import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class GetOTPDTO {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string
}
