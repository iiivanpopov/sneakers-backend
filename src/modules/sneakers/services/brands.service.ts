import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBrandMany<T extends Prisma.BrandFindManyArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T>[]> {
    return this.prisma.brand.findMany(args) as any
  }

  async findBrandUnique<T extends Prisma.BrandFindUniqueArgs>(
    args: T
  ): Promise<Prisma.BrandGetPayload<T> | null> {
    return this.prisma.brand.findUnique(args) as any
  }
}
