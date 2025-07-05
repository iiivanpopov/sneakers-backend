import { Injectable } from '@nestjs/common'

import { CreateSneakerPayload } from '../../domain/interfaces/create-sneaker-payload'
import { UpdateSneakersPayload } from '../../domain/interfaces/update-sneakers-payload'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class SneakersRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createSneaker(slug: string, data: CreateSneakerPayload) {
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

	async findSneakers(slug: string) {
		return this.prisma.sneaker.findMany({
			where: {
				sneakerModel: {
					slug
				}
			}
		})
	}

	async sneakerExists(slug: string, size: number) {
		return this.prisma.sneaker.findFirst({
			where: { sneakerModel: { slug }, size }
		})
	}

	async updateSneakers(modelId: string, payload: UpdateSneakersPayload) {
		const promises = []

		for (const sneaker of payload.sneakers) {
			const size = sneaker.size
			const quantity = sneaker.quantity

			promises.push(
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
		}

		return Promise.all(promises)
	}
}
