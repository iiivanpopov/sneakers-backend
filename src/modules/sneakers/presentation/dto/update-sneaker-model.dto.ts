import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator'

export class UpdateSneakerModelDTO {
	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
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

	@IsOptional()
	@IsNumber()
	price: number

	@IsOptional()
	@IsString()
	slug: string
}
