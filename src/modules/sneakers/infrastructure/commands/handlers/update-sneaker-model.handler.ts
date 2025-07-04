import { SneakerModel } from '@generated/prisma'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { UpdateSneakerModelCommand } from '../update-sneaker-model.command'

import { SneakerModelNotFound } from '@/exceptions/sneakers/sneaker-model-not-found.exception'

@CommandHandler(UpdateSneakerModelCommand)
export class UpdateSneakerModelHandler
	implements ICommandHandler<UpdateSneakerModelCommand>
{
	constructor(private readonly sneakersRepository: SneakerModelsRepository) {}
	async execute(command: UpdateSneakerModelCommand): Promise<SneakerModel> {
		const exists = await this.sneakersRepository.sneakerModelExistsBySlug(
			command.slug
		)
		if (!exists) throw new SneakerModelNotFound()
		return this.sneakersRepository.updateSneakerModel(
			command.slug,
			command.sneakerModel
		)
	}
}
