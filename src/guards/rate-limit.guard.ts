import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private rateLimiter: RateLimiterMemory;

  constructor() {
    this.rateLimiter = new RateLimiterMemory({
      points: 10,
      duration: 1,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.ip;

    try {
      await this.rateLimiter.consume(key);
      return true;
    } catch {
      throw new Error('Too Many Requests');
    }
  }
}
