import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator'

export class UpdateUserDTO {
	@IsOptional()
	@IsString()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	phone?: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password?: string
}
