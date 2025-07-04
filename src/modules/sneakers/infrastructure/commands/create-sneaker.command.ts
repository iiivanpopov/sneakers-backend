import { CreateSneakerPayload } from '../../domain/interfaces/create-sneaker-payload'

export class CreateSneakerCommand {
	constructor(
		public readonly slug: string,
		public readonly sneaker: CreateSneakerPayload
	) {}
}
