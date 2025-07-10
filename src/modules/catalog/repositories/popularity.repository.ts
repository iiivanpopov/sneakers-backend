import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PopularityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique<T extends Prisma.PopularityFindUniqueArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T> | null> {
    return this.prisma.popularity.findUnique(
      args
    ) as unknown as Promise<Prisma.PopularityGetPayload<T> | null>
  }

  async findFirst<T extends Prisma.PopularityFindFirstArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T> | null> {
    return this.prisma.popularity.findFirst(
      args
    ) as unknown as Promise<Prisma.PopularityGetPayload<T> | null>
  }

  async findMany<T extends Prisma.PopularityFindManyArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T>[]> {
    return this.prisma.popularity.findMany(args) as unknown as Promise<
      Prisma.PopularityGetPayload<T>[]
    >
  }

  async create<T extends Prisma.PopularityCreateArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T>> {
    return this.prisma.popularity.create(args) as unknown as Promise<
      Prisma.PopularityGetPayload<T>
    >
  }

  async update<T extends Prisma.PopularityUpdateArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T>> {
    return this.prisma.popularity.update(args) as unknown as Promise<
      Prisma.PopularityGetPayload<T>
    >
  }

  async upsert<T extends Prisma.PopularityUpsertArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T>> {
    return this.prisma.popularity.upsert(args) as unknown as Promise<
      Prisma.PopularityGetPayload<T>
    >
  }

  async delete<T extends Prisma.PopularityDeleteArgs>(
    args: T
  ): Promise<Prisma.PopularityGetPayload<T>> {
    return this.prisma.popularity.delete(args) as unknown as Promise<
      Prisma.PopularityGetPayload<T>
    >
  }

  async deleteMany<T extends Prisma.PopularityDeleteManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.popularity.deleteMany(args)
  }

  async updateMany<T extends Prisma.PopularityUpdateManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.popularity.updateMany(args)
  }
}
