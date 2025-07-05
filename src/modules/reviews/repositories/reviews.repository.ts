import { Injectable } from '@nestjs/common'

import { CreateReviewDTO } from '../dto/create-review.dto'
import { UpdateReviewDTO } from '../dto/update-review.dto'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class ReviewsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(id: string, review: CreateReviewDTO, userId: string) {
		return this.prisma.review.create({
			data: { ...review, userId, sneakerModelId: id }
		})
	}

	async delete(id: string) {
		return this.prisma.review.delete({
			where: { id }
		})
	}

	async update(id: string, review: Partial<UpdateReviewDTO>) {
		return this.prisma.review.update({
			where: { id },
			data: review
		})
	}

	async findManyBySneakerModelId(id: string) {
		return this.prisma.review.findMany({
			where: { sneakerModelId: id }
		})
	}

	async findById(id: string) {
		return this.prisma.review.findFirst({
			where: { id }
		})
	}
}
