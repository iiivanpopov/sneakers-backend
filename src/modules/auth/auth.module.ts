import { Module } from '@nestjs/common'

import { CartRepository } from '../cart/repositories/cart.repository'
import { RedisModule } from '../redis/redis.module'
import { TokenModule } from '../token/token.module'

import { OTPRepository } from './infrastructure/repositories/otp.repository'
import { UserRepository } from './infrastructure/repositories/user.repository'
import { AuthService } from './infrastructure/services/auth.service'
import { AuthController } from './presentation/controllers/auth.controller'

import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule, RedisModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService, OTPRepository, UserRepository, CartRepository]
})
export class AuthModule {}
