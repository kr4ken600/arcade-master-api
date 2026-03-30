import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.redisClient.get<T>(key);
  }

  async set(
    key: string,
    value: any,
    ttlInSeconds: number = 300,
  ): Promise<void> {
    await this.redisClient.set(key, value, { ex: ttlInSeconds });
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
