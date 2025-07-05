import { SneakerModel } from '@generated/prisma'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { SneakerModelsRepository } from '../../repositories/sneaker-models.repository'
import { DeleteSneakerModelCommand } from '../delete-sneaker-model.command'

import { SneakerModelNotFound } from '@/exceptions/sneakers/sneaker-model-not-found.exception'

@CommandHandler(DeleteSneakerModelCommand)
export class DeleteSneakerModelHandler
	implements ICommandHandler<DeleteSneakerModelCommand>
{
	constructor(private readonly sneakersRepository: SneakerModelsRepository) {}
	async execute(command: DeleteSneakerModelCommand): Promise<SneakerModel> {
		const exists = await this.sneakersRepository.existsBySlug(command.slug)
		if (!exists) throw new SneakerModelNotFound()
		return this.sneakersRepository.delete(command.slug)
	}
}
