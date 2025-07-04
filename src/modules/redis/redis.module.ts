import { Module } from '@nestjs/common'

import { RedisClientProvider } from './redis.provider'
import { RedisService } from './redis.service'

@Module({
	providers: [RedisClientProvider, RedisService],
	exports: [RedisService]
})
export class RedisModule {}
