import { AuthModule } from '@/utils/services/auth'
import { PrismaModule } from '@/utils/services/prisma'
import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { OtpsModule } from '../otps'
import { TokenModule } from '@/utils/services/auth/common/token/token.module'

@Module({
  imports: [PrismaModule, AuthModule, OtpsModule, TokenModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
