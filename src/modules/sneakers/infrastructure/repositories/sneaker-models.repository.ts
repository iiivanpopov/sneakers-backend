import { Prisma } from '@generated/prisma'
import { Injectable } from '@nestjs/common'

import { CreateSneakerModelPayload } from '../../domain/interfaces/create-sneaker-model-payload'
import { UpdateSneakerModelPayload } from '../../domain/interfaces/update-sneaker-model-payload'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class SneakerModelsRepository {
	private readonly baseSelect = {
		id: true,
		name: true,
		brand: true,
		colorway: true,
		releaseAt: true,
		imageUrl: true,
		price: true,
		slug: true
	}

	constructor(private readonly prisma: PrismaService) {}

	private buildSelect(userId?: string) {
		return {
			...this.baseSelect,
			...(userId && {
				_count: {
					select: {
						favouredBy: {
							where: { id: userId }
						}
					}
				}
			})
		}
	}

	private mapWithIsFavored<T extends { _count?: { favouredBy: number } }>(
		sneaker: T,
		rest: Partial<T> = {}
	): T & { isFavored: boolean } {
		const isFavored = sneaker._count?.favouredBy > 0
		const { _count, ...data } = sneaker
		return { ...data, ...rest, isFavored } as T & { isFavored: boolean }
	}

	async findOne(args: Prisma.SneakerModelFindFirstArgs, userId?: string) {
		const sneaker = await this.prisma.sneakerModel.findFirst({
			select: this.buildSelect(userId),
			...args
		})

		return sneaker ? this.mapWithIsFavored(sneaker) : null
	}

	async findMany(
		args: Partial<Prisma.SneakerModelFindManyArgs> = {},
		userId?: string
	) {
		const sneakers = await this.prisma.sneakerModel.findMany({
			select: this.buildSelect(userId),
			...args
		})

		return sneakers.map(s => this.mapWithIsFavored(s))
	}

	async findBySlug(slug: string, userId?: string) {
		const sneaker = await this.prisma.sneakerModel.findUnique({
			where: { slug },
			include: {
				items: {
					select: {
						id: true,
						size: true,
						quantity: true
					}
				},
				...(userId && {
					_count: {
						select: {
							favouredBy: {
								where: { id: userId }
							}
						}
					}
				})
			}
		})

		return sneaker
			? this.mapWithIsFavored(sneaker, { items: sneaker.items })
			: null
	}

	async findManyBySlugs(slugs: string[], userId?: string) {
		if (!slugs.length) return []

		const sneakers = await this.prisma.sneakerModel.findMany({
			where: { slug: { in: slugs } },
			select: this.buildSelect(userId)
		})

		return sneakers.map(s => this.mapWithIsFavored(s))
	}

	async getBrands(): Promise<{ brand: string }[]> {
		return this.prisma.sneakerModel.findMany({
			select: { brand: true },
			distinct: ['brand']
		})
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
		return this.prisma.sneakerModel.delete({
			where: { slug }
		})
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
