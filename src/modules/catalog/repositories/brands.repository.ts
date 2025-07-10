import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BrandsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique<T extends Prisma.BrandFindUniqueArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T> | null> {
    return this.prisma.brand.findUnique(
      args
    ) as unknown as Promise<Prisma.BrandGetPayload<T> | null>
  }

  async findFirst<T extends Prisma.BrandFindFirstArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T> | null> {
    return this.prisma.brand.findFirst(
      args
    ) as unknown as Promise<Prisma.BrandGetPayload<T> | null>
  }

  async findMany<T extends Prisma.BrandFindManyArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T>[]> {
    return this.prisma.brand.findMany(args) as unknown as Promise<
      Prisma.BrandGetPayload<T>[]
    >
  }

  async create<T extends Prisma.BrandCreateArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T>> {
    return this.prisma.brand.create(args) as unknown as Promise<
      Prisma.BrandGetPayload<T>
    >
  }

  async update<T extends Prisma.BrandUpdateArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T>> {
    return this.prisma.brand.update(args) as unknown as Promise<
      Prisma.BrandGetPayload<T>
    >
  }

  async upsert<T extends Prisma.BrandUpsertArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T>> {
    return this.prisma.brand.upsert(args) as unknown as Promise<
      Prisma.BrandGetPayload<T>
    >
  }

  async delete<T extends Prisma.BrandDeleteArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T>> {
    return this.prisma.brand.delete(args) as unknown as Promise<
      Prisma.BrandGetPayload<T>
    >
  }

  async deleteMany<T extends Prisma.BrandDeleteManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.brand.deleteMany(args)
  }

  async updateMany<T extends Prisma.BrandUpdateManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.brand.updateMany(args)
  }
}
