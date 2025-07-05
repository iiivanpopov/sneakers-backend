import { IsNumber, IsString } from 'class-validator'

export class AddCartItemDTO {
	@IsNumber()
	size: number

	@IsString()
	sneakerId: string

	@IsNumber()
	quantity: number
}
