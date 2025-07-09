import { Injectable } from '@nestjs/common'

@Injectable()
export class BaseResolver {
  protected wrapSuccess<T extends object>(data?: T): T & { success: true } {
    return {
      success: true,
      ...data
    } as T & { success: true }
  }

  protected wrapFail<T>(reason?: string, data?: T) {
    return {
      success: false,
      reason,
      ...data
    }
  }
}
