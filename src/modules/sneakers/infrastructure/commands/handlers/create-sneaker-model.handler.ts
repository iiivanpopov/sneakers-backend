import { SneakerModel } from '@generated/prisma'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { SneakersRepository } from '../../repositories/sneaker.repository'
import { CreateSneakerCommand } from '../create-sneaker-model.command'

import { SneakerModelAlreadyExists } from '@/exceptions/sneakers'

@CommandHandler(CreateSneakerCommand)
export class CreateSneakerModelHandler
	implements ICommandHandler<CreateSneakerCommand>
{
	constructor(private readonly sneakersRepository: SneakersRepository) {}
	async execute(command: CreateSneakerCommand): Promise<SneakerModel> {
		const exists = await this.sneakersRepository.sneakerModelExistsBySlug(
			command.sneakerModel.slug
		)
		if (exists) throw new SneakerModelAlreadyExists()
		return this.sneakersRepository.createSneakerModel(command.sneakerModel)
	}
}
