import { Prisma } from '@generated/prisma'
import { Injectable } from '@nestjs/common'

import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'
import { UpdateSneakerModelPayload } from '../../domain/interfaces/update-sneaker-model-payload'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class SneakerModelsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findOne(args: Prisma.SneakerModelFindFirstArgs) {
		return this.prisma.sneakerModel.findFirst({
			select: {
				id: true,
				name: true,
				brand: true,
				price: true,
				slug: true,
				imageUrl: true
			},
			...args
		})
	}

	async findMany(args: Partial<Prisma.SneakerModelFindManyArgs> = {}) {
		return this.prisma.sneakerModel.findMany({
			select: {
				id: true,
				name: true,
				brand: true,
				price: true,
				slug: true,
				imageUrl: true
			},
			...args
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
						quantity: true
					}
				}
			}
		})
	}

	async findManyBySlugs(slugs: string[]) {
		if (!slugs.length) return []
		return this.prisma.sneakerModel.findMany({
			where: { slug: { in: slugs } },
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

	async getBrands(): Promise<{ brand: string }[]> {
		return this.prisma.$queryRaw`
			SELECT DISTINCT brand FROM sneaker_model
		`
	}

	async create(data: CreateSneakerModelPayload) {
		return this.prisma.sneakerModel.create({ data })
	}

	async update(slug: string, data: Partial<UpdateSneakerModelPayload>) {
		return this.prisma.sneakerModel.update({
			where: { slug },
			data
		})
	}

	async delete(slug: string) {
		return this.prisma.sneakerModel.delete({ where: { slug } })
	}

	async existsBySlug(slug: string): Promise<boolean> {
		const res = await this.prisma.sneakerModel.findUnique({
			where: { slug },
			select: { id: true }
		})
		return !!res
	}

	async existsById(id: string): Promise<boolean> {
		const res = await this.prisma.sneakerModel.findUnique({
			where: { id },
			select: { id: true }
		})
		return !!res
	}
}
