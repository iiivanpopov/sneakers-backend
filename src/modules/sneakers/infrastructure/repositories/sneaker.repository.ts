import { Prisma } from '@generated/prisma'
import { Injectable } from '@nestjs/common'

import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class SneakersRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findMany(args: Partial<Prisma.SneakerModelFindManyArgs>) {
		return this.prisma.sneakerModel.findMany({
			...args,
			select: {
				id: true,
				name: true,
				brand: true,
				price: true,
				slug: true
			}
		})
	}

	async createSneakerModel(sneakerModel: CreateSneakerModelPayload) {
		const data = {
			...sneakerModel,
			colorway: sneakerModel.colorway ?? null,
			releaseAt: sneakerModel.releaseAt
				? new Date(sneakerModel.releaseAt)
				: null,
			imageUrl: sneakerModel.imageUrl ?? null
		}

		return this.prisma.sneakerModel.create({ data })
	}

	async sneakerModelExistsBySlug(slug: string) {
		return this.prisma.sneakerModel.findFirst({ where: { slug } })
	}
}
