import { Min, Max, IsInt } from 'class-validator'

export class CreateSneakerDTO {
	@Min(30)
	@Max(50)
	size: number

	@IsInt()
	@Min(0)
	quantity: number
}
