import { Prisma } from '@generated/prisma'
import { Injectable } from '@nestjs/common'

import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'
import { UpdateSneakerModelPayload } from '../../domain/interfaces/update-sneaker-model-payload'

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
				slug: true,
				imageUrl: true
			}
		})
	}

	async findBySlug(slug: string) {
		return this.prisma.sneakerModel.findUnique({
			where: { slug },
			include: {
				items: {
					select: {
						id: true,
						size: true,
						inStock: true
					}
				}
			}
		})
	}

	async createSneakerModel(data: CreateSneakerModelPayload) {
		return this.prisma.sneakerModel.create({ data })
	}

	async sneakerModelExistsBySlug(slug: string) {
		return this.prisma.sneakerModel.findFirst({ where: { slug } })
	}

	async deleteSneakerModel(slug: string) {
		return this.prisma.sneakerModel.delete({ where: { slug } })
	}

	async updateSneakerModel(
		slug: string,
		sneakerModel: Partial<UpdateSneakerModelPayload>
	) {
		return this.prisma.sneakerModel.update({
			where: { slug },
			data: sneakerModel
		})
	}
}
