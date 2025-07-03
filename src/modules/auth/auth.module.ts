import { PrismaModule } from '@app/prisma/prisma.module'
import { Module } from '@nestjs/common'

import { RedisModule } from '../redis/redis.module'
import { TokenModule } from '../token/token.module'

import { OtpRepository } from './infrastructure/repositories/otp.repository'
import { UserRepository } from './infrastructure/repositories/user.repository'
import { AuthService } from './infrastructure/services/auth.service'
import { AuthController } from './presentation/controllers/auth.controller'

@Module({
	imports: [PrismaModule, RedisModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService, OtpRepository, UserRepository]
})
export class AuthModule {}
