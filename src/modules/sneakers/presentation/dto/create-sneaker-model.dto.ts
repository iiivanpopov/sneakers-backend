import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator'

export class CreateSneakerModelDTO {
	@IsString()
	name: string

	@IsString()
	brand: string

	@IsOptional()
	@IsString()
	colorway?: string

	@IsOptional()
	@IsDateString()
	releaseAt?: string

	@IsOptional()
	@IsString()
	imageUrl?: string

	@IsNumber()
	price: number

	@IsString()
	slug: string
}
