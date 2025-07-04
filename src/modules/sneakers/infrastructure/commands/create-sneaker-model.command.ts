import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'

export class CreateSneakerModelCommand {
	constructor(public readonly sneakerModel: CreateSneakerModelPayload) {}
}
