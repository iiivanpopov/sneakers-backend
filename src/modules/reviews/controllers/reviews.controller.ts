import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common'

import { CreateReviewDTO } from '../dto/create-review.dto'
import { UpdateReviewDTO } from '../dto/update-review.dto'
import { ReviewsService } from '../services/reviews.service'

import { User } from '@/auth/domain/entities/User'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/token/jwt/jwt.guard'

@Controller()
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Get('/sneakers/:id/reviews')
	async getReviews(@Param('id') id: string) {
		const data = await this.reviewsService.get(id)

		return { review: data, message: 'Fetched reviews successfully' }
	}

	@Post('/sneakers/:id/reviews')
	@UseGuards(JwtAuthGuard)
	async createReview(
		@Param('id') id: string,
		@Body() body: CreateReviewDTO,
		@CurrentUser() user: User
	) {
		await this.reviewsService.create(id, body, user)

		return { success: true, message: 'Created review successfully' }
	}

	@Patch('/reviews/:id')
	@UseGuards(JwtAuthGuard)
	async updateReview(
		@Param('id') id: string,
		@Body() body: UpdateReviewDTO,
		@CurrentUser() user: User
	) {
		await this.reviewsService.update(id, user, body)

		return { success: true, message: 'Updated review successfully' }
	}

	@Delete('/reviews/:id')
	@UseGuards(JwtAuthGuard)
	async deleteReview(@Param('id') id: string, @CurrentUser() user: User) {
		await this.reviewsService.delete(id, user)

		return { success: true, message: 'Deleted review successfully' }
	}
}
