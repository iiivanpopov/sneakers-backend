import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SneakersService {
  constructor(private readonly prisma: PrismaService) {}

  async findSneakerFirst<T extends Prisma.SneakerFindFirstArgs>(
    args: T
  ): Promise<Prisma.SneakerGetPayload<T> | null> {
    return this.prisma.sneaker.findFirst(args) as any
  }

  async findSneakerUnique<T extends Prisma.SneakerFindUniqueArgs>(
    args: T
  ): Promise<Prisma.SneakerGetPayload<T> | null> {
    return this.prisma.sneaker.findUnique(args) as any
  }

  async findSneakerMany<T extends Prisma.SneakerFindManyArgs>(
    args: T
  ): Promise<Prisma.SneakerGetPayload<T>[]> {
    return this.prisma.sneaker.findMany(args) as any
  }
}
