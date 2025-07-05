import { Module } from '@nestjs/common'

import { RedisModule } from '../redis/redis.module'

import { ReviewsController } from './controllers/reviews.controller'
import { ReviewsRepository } from './repositories/reviews.repository'
import { ReviewsService } from './services/reviews.service'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [RedisModule, PrismaModule],
	controllers: [ReviewsController],
	providers: [ReviewsService, ReviewsRepository]
})
export class ReviewsModule {}
