import { RedisModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { OtpsService } from './otps.service'
import { OtpsController } from './otps.controller'
import { MailService } from '@/utils/services/mail/mail.service'
import { MailModule } from '@/utils/services/mail/mail.module'

@Module({
  imports: [RedisModule, MailModule],
  providers: [OtpsService, MailService],
  controllers: [OtpsController],
  exports: [OtpsService]
})
export class OtpsModule {}
