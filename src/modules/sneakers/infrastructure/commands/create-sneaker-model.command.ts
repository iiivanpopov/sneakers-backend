import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'

export class CreateSneakerCommand {
	constructor(public readonly sneakerModel: CreateSneakerModelPayload) {}
}
