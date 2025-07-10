import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DiscountRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findUnique<T extends Prisma.DiscountFindUniqueArgs>(
    args: T
  ): Promise<Prisma.DiscountGetPayload<T> | null> {
    return this.prisma.discount.findUnique(
      args
    ) as unknown as Promise<Prisma.DiscountGetPayload<T> | null>
  }

  async findFirst<T extends Prisma.DiscountFindFirstArgs>(
    args: T
  ): Promise<Prisma.DiscountGetPayload<T> | null> {
    return this.prisma.discount.findFirst(
      args
    ) as unknown as Promise<Prisma.DiscountGetPayload<T> | null>
  }

  async findMany<T extends Prisma.DiscountFindManyArgs>(
    args: T
  ): Promise<Prisma.DiscountGetPayload<T>[]> {
    return this.prisma.discount.findMany(args) as unknown as Promise<
      Prisma.DiscountGetPayload<T>[]
    >
  }

  async create<T extends Prisma.DiscountCreateArgs>(
    args: T
  ): Promise<Prisma.DiscountGetPayload<T>> {
    return this.prisma.discount.create(args) as unknown as Promise<
      Prisma.DiscountGetPayload<T>
    >
  }

  async update<T extends Prisma.DiscountUpdateArgs>(
    args: T
  ): Promise<Prisma.DiscountGetPayload<T>> {
    return this.prisma.discount.update(args) as unknown as Promise<
      Prisma.DiscountGetPayload<T>
    >
  }

  async upsert<T extends Prisma.DiscountUpsertArgs>(
    args: T
  ): Promise<Prisma.DiscountGetPayload<T>> {
    return this.prisma.discount.upsert(args) as unknown as Promise<
      Prisma.DiscountGetPayload<T>
    >
  }

  async delete<T extends Prisma.DiscountDeleteArgs>(
    args: T
  ): Promise<Prisma.DiscountGetPayload<T>> {
    return this.prisma.discount.delete(args) as unknown as Promise<
      Prisma.DiscountGetPayload<T>
    >
  }

  async deleteMany<T extends Prisma.DiscountDeleteManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.discount.deleteMany(args)
  }

  async updateMany<T extends Prisma.DiscountUpdateManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.discount.updateMany(args)
  }
}
