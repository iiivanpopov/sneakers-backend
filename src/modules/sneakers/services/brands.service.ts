import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBrandMany<T extends Prisma.BrandFindManyArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T>[]> {
    return this.prisma.brand.findMany(args) as unknown as Promise<
      Prisma.BrandGetPayload<T>[]
    >
  }

  async findBrandUnique<T extends Prisma.BrandFindUniqueArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T> | null> {
    return this.prisma.brand.findUnique(
      args
    ) as unknown as Promise<Prisma.BrandGetPayload<T> | null>
  }

  async create<T extends Prisma.BrandCreateArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T>> {
    return this.prisma.brand.create(args) as unknown as Promise<
      Prisma.BrandGetPayload<T>
    >
  }
}
