import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique<T extends Prisma.StockFindUniqueArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T> | null> {
    return this.prisma.stock.findUnique(
      args
    ) as unknown as Promise<Prisma.StockGetPayload<T> | null>
  }

  async findFirst<T extends Prisma.StockFindFirstArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T> | null> {
    return this.prisma.stock.findFirst(
      args
    ) as unknown as Promise<Prisma.StockGetPayload<T> | null>
  }

  async findMany<T extends Prisma.StockFindManyArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T>[]> {
    return this.prisma.stock.findMany(args) as unknown as Promise<
      Prisma.StockGetPayload<T>[]
    >
  }

  async create<T extends Prisma.StockCreateArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T>> {
    return this.prisma.stock.create(args) as unknown as Promise<
      Prisma.StockGetPayload<T>
    >
  }

  async update<T extends Prisma.StockUpdateArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T>> {
    return this.prisma.stock.update(args) as unknown as Promise<
      Prisma.StockGetPayload<T>
    >
  }

  async upsert<T extends Prisma.StockUpsertArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T>> {
    return this.prisma.stock.upsert(args) as unknown as Promise<
      Prisma.StockGetPayload<T>
    >
  }

  async delete<T extends Prisma.StockDeleteArgs>(
    args: T
  ): Promise<Prisma.StockGetPayload<T>> {
    return this.prisma.stock.delete(args) as unknown as Promise<
      Prisma.StockGetPayload<T>
    >
  }

  async deleteMany<T extends Prisma.StockDeleteManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.stock.deleteMany(args)
  }

  async updateMany<T extends Prisma.StockUpdateManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.stock.updateMany(args)
  }
}
