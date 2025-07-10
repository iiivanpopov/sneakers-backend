import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SneakersRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findFirst<T extends Prisma.SneakerFindFirstArgs>(
    args: T
  ): Promise<Prisma.SneakerGetPayload<T> | null> {
    return this.prisma.sneaker.findFirst(
      args
    ) as unknown as Promise<Prisma.SneakerGetPayload<T> | null>
  }

  async findUnique<T extends Prisma.SneakerFindUniqueArgs>(
    args: T
  ): Promise<Prisma.SneakerGetPayload<T> | null> {
    return this.prisma.sneaker.findUnique(
      args
    ) as unknown as Promise<Prisma.SneakerGetPayload<T> | null>
  }

  async findMany<T extends Prisma.SneakerFindManyArgs>(
    args: T
  ): Promise<Prisma.SneakerGetPayload<T>[]> {
    return this.prisma.sneaker.findMany(args) as unknown as Promise<
      Prisma.SneakerGetPayload<T>[]
    >
  }

  async create<T extends Prisma.SneakerCreateArgs>(
    args: T
  ): Promise<Prisma.SneakerGetPayload<T>> {
    return this.prisma.sneaker.create(args) as unknown as Promise<
      Prisma.SneakerGetPayload<T>
    >
  }
}
