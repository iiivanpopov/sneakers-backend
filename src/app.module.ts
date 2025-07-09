import { RedisModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './modules/users'
import { OtpsModule } from './modules/otps'
import { SneakersModule } from './modules/sneakers/sneakers.module'
import { CartModule } from './modules/cart'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL
    }),
    OtpsModule,
    UsersModule,
    SneakersModule,
    CartModule
  ]
})
export class AppModule {}
