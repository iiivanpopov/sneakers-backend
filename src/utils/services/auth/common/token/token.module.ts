import { PrismaModule } from '@/utils/services/prisma'
import { Module } from '@nestjs/common'
import { TokenService } from './token.service'

@Module({
  imports: [PrismaModule],
  exports: [TokenService],
  providers: [TokenService]
})
export class TokenModule {}
