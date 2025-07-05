import { Injectable } from '@nestjs/common'

import { CreateSneakerPayload } from '../../domain/interfaces/create-sneaker-payload'
import { UpdateSneakersPayload } from '../../domain/interfaces/update-sneakers-payload'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class SneakersRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(slug: string, data: CreateSneakerPayload) {
		return this.prisma.sneaker.create({
			data: {
				size: data.size,
				quantity: data.quantity,
				sneakerModel: {
					connect: { slug }
				}
			}
		})
	}

	async findBySlug(slug: string) {
		return this.prisma.sneaker.findMany({
			where: { sneakerModel: { slug } },
			select: {
				id: true,
				size: true,
				quantity: true,
				sneakerModelId: true
			}
		})
	}

	async exists(slug: string, size: number): Promise<boolean> {
		const result = await this.prisma.sneaker.findFirst({
			where: { sneakerModel: { slug }, size },
			select: { id: true }
		})
		return !!result
	}

	async updateMany(modelId: string, payload: UpdateSneakersPayload) {
		return Promise.all(
			payload.sneakers.map(({ size, quantity }) =>
				this.prisma.sneaker.upsert({
					where: {
						sneakerModelId_size: {
							sneakerModelId: modelId,
							size
						}
					},
					update: { quantity },
					create: {
						sneakerModelId: modelId,
						size,
						quantity
					}
				})
			)
		)
	}
}
