import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { mapToOtpEntity, OtpEntity } from './entities'
import { OTP_REDIS_KEY } from './constants'

@Injectable()
export class OtpsService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getRedisKey(email: string): string {
    return OTP_REDIS_KEY(email)
  }

  async findAll(): Promise<OtpEntity[] | null> {
    const keys = await this.redis.keys('otp:*')
    if (!keys.length) return null

    const otps: OtpEntity[] = []

    for (const key of keys) {
      const data = await this.redis.hgetall(key)
      if (Object.keys(data).length === 0) continue
      otps.push(mapToOtpEntity(data))
    }

    return otps
  }

  async create(otp: OtpEntity, ttlSeconds: number): Promise<void> {
    const key = this.getRedisKey(otp.email)
    const data = {
      email: otp.email,
      code: otp.code.toString(),
      retryAt: otp.retryAt.toString()
    }
    await this.redis.hmset(key, data)
    await this.redis.expire(key, ttlSeconds)
  }

  async findByEmail(email: string): Promise<OtpEntity | null> {
    const key = this.getRedisKey(email)
    const data = await this.redis.hgetall(key)
    if (Object.keys(data).length === 0) return null
    return mapToOtpEntity(data)
  }

  async deleteByEmail(email: string): Promise<void> {
    const key = this.getRedisKey(email)
    await this.redis.del(key)
  }
}
