import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

export const RedisClientProvider = {
	provide: 'REDIS_CLIENT',
	inject: [ConfigService],
	useFactory: (config: ConfigService) => {
		return new Redis({
			host: config.get('redis.redisHost'),
			port: config.get<number>('redis.redisPort')
		})
	}
}
