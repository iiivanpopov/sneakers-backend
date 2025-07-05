import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNumber, Min, ValidateNested } from 'class-validator'

export class UpdateSneakersDTO {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SizeQuantityDto)
	sneakers: SizeQuantityDto[]
}

export class SizeQuantityDto {
	@IsNumber()
	size: number

	@IsInt()
	@Min(0)
	quantity: number
}
