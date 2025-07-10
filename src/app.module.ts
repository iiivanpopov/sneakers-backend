import { RedisModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './modules/users'
import { OtpsModule } from './modules/otps'
import { CartModule } from './modules/cart'
import { CatalogModule } from './modules/catalog'

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
    CatalogModule,
    CartModule
  ]
})
export class AppModule {}
