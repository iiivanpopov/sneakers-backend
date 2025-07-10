import { Injectable, NotFoundException } from '@nestjs/common'
import { PopularityRepository } from '../repositories/popularity.repository'

@Injectable()
export class PopularityService extends PopularityRepository {
  async incrementViews(sneakerId: string): Promise<void> {
    const popularity = await this.findFirst({
      where: {
        sneakers: {
          some: {
            id: sneakerId
          }
        }
      },
      select: { id: true }
    })

    if (!popularity) throw new NotFoundException('Sneaker not found')

    await this.upsert({
      where: {
        id: popularity.id
      },
      update: {
        views: { increment: 1 }
      },
      create: {
        views: 1,
        purchases: 0
      }
    })
  }
}
