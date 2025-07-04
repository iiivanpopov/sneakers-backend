import { UpdateSneakerModelPayload } from '../../domain/interfaces/update-sneaker-model-payload'

export class UpdateSneakerModelCommand {
	constructor(
		public readonly slug: string,
		public readonly sneakerModel: Partial<UpdateSneakerModelPayload>
	) {}
}
