import { Injectable } from '@nestjs/common'
import { FavoritesRepository } from './favorites.repository'
import { PrismaService } from '@/utils/services/prisma'

@Injectable()
export class FavoritesService extends FavoritesRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma)
  }
}
