import { IsNumber, IsOptional } from 'class-validator'

export class UpdateCartItemDTO {
	@IsOptional()
	@IsNumber()
	size?: number

	@IsOptional()
	@IsNumber()
	quantity?: number
}
