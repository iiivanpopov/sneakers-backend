import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class FavoritesRepository {
	constructor(private readonly prisma: PrismaService) {}

	async get(userId: string) {
		return this.prisma.sneakerModel.findMany({
			where: {
				favouredBy: {
					some: { id: userId }
				}
			}
		})
	}

	async exists(userId: string, slug: string) {
		return this.prisma.sneakerModel.findFirst({
			where: {
				slug,
				favouredBy: {
					some: { id: userId }
				}
			}
		})
	}

	async add(userId: string, slug: string) {
		return this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				favorites: {
					connect: {
						slug
					}
				}
			}
		})
	}

	async delete(userId: string, slug: string) {
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				favorites: {
					disconnect: { slug }
				}
			}
		})
	}
}
