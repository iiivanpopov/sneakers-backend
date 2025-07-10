import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async findStockMany<T extends Prisma.StockFindManyArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T>[]> {
    return this.prisma.stock.findMany(args) as any
  }

  async findStockFirst<T extends Prisma.StockFindFirstArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T> | null> {
    return this.prisma.stock.findFirst(args) as any
  }

  async findPopularityMany<T extends Prisma.PopularityFindManyArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T>[]> {
    return this.prisma.popularity.findMany(args) as any
  }

  async findPopularityFirst<T extends Prisma.PopularityFindFirstArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T> | null> {
    return this.prisma.popularity.findFirst(args) as any
  }

  async upsert<T extends Prisma.StockUpsertArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T>> {
    return this.prisma.stock.upsert(args) as unknown as Promise<
      Prisma.StockGetPayload<T>
    >
  }
}
