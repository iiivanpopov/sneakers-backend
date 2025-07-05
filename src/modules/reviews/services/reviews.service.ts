import { Injectable, ForbiddenException } from '@nestjs/common'

import { CreateReviewDTO } from '../dto/create-review.dto'
import { UpdateReviewDTO } from '../dto/update-review.dto'
import { ReviewsRepository } from '../repositories/reviews.repository'

import { User } from '@/auth/domain/entities/User'
import { ReviewNotFound } from '@/exceptions/index'

@Injectable()
export class ReviewsService {
	constructor(private readonly reviewsRepository: ReviewsRepository) {}

	async delete(id: string, user: User) {
		const exists = await this.reviewsRepository.findById(id)
		if (!exists) throw new ReviewNotFound()

		if (exists.userId !== user.id) throw new ForbiddenException()

		return this.reviewsRepository.delete(id)
	}

	async update(id: string, user: User, review: Partial<UpdateReviewDTO>) {
		const exists = await this.reviewsRepository.findById(id)
		if (!exists) throw new ReviewNotFound()

		if (exists.userId !== user.id) throw new ForbiddenException()

		return this.reviewsRepository.update(id, review)
	}

	async create(id: string, review: CreateReviewDTO, user: User) {
		return this.reviewsRepository.create(id, review, user.id)
	}

	async get(id: string) {
		const reviews = await this.reviewsRepository.findManyBySneakerModelId(id)

		if (reviews.length == 0) return []

		return reviews
	}
}
