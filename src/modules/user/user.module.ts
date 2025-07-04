import { Module } from '@nestjs/common'

import { RedisModule } from '../redis/redis.module'

import { UserRepository } from './infrastructure/repositories/user.repository'
import { UserService } from './infrastructure/services/user.service'
import { UserController } from './presentation/controllers/user.controller'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	providers: [UserRepository, UserService],
	imports: [PrismaModule, RedisModule],
	controllers: [UserController]
})
export class UserModule {}
