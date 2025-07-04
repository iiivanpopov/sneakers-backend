import { SneakerModel } from '@generated/prisma'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { CreateSneakerModelCommand } from '../create-sneaker-model.command'

import { SneakerModelAlreadyExists } from '@/exceptions/sneakers'

@CommandHandler(CreateSneakerModelCommand)
export class CreateSneakerModelHandler
	implements ICommandHandler<CreateSneakerModelCommand>
{
	constructor(
		private readonly sneakersModelRepository: SneakerModelsRepository
	) {}

	async execute(command: CreateSneakerModelCommand): Promise<SneakerModel> {
		const exists = await this.sneakersModelRepository.sneakerModelExistsBySlug(
			command.sneakerModel.slug
		)
		if (exists) throw new SneakerModelAlreadyExists()
		return this.sneakersModelRepository.createSneakerModel(command.sneakerModel)
	}
}
