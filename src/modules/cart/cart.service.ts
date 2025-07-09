import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst<T extends Prisma.CartItemFindFirstArgs>(
    args: T
  ): Promise<Prisma.CartItemGetPayload<T> | null> {
    return this.prisma.cartItem.findFirst(
      args
    ) as unknown as Promise<Prisma.CartItemGetPayload<T> | null>
  }

  async findUnique<T extends Prisma.CartItemFindUniqueArgs>(
    args: T
  ): Promise<Prisma.CartItemGetPayload<T> | null> {
    return this.prisma.cartItem.findUnique(
      args
    ) as unknown as Promise<Prisma.CartItemGetPayload<T> | null>
  }

  async findMany<T extends Prisma.CartItemFindManyArgs>(
    args: T
  ): Promise<Prisma.CartItemGetPayload<T>[]> {
    return this.prisma.cartItem.findMany(args) as unknown as Promise<
      Prisma.CartItemGetPayload<T>[]
    >
  }

  async create<T extends Prisma.CartItemCreateArgs>(
    args: T
  ): Promise<Prisma.CartItemGetPayload<T>> {
    return this.prisma.cartItem.create(args) as unknown as Promise<
      Prisma.CartItemGetPayload<T>
    >
  }

  async update<T extends Prisma.CartItemUpdateArgs>(
    args: T
  ): Promise<Prisma.CartItemGetPayload<T>> {
    return this.prisma.cartItem.update(args) as unknown as Promise<
      Prisma.CartItemGetPayload<T>
    >
  }

  async delete<T extends Prisma.CartItemDeleteArgs>(
    args: T
  ): Promise<Prisma.CartItemGetPayload<T>> {
    return this.prisma.cartItem.delete(args) as unknown as Promise<
      Prisma.CartItemGetPayload<T>
    >
  }

  async deleteMany<T extends Prisma.CartItemDeleteManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.cartItem.deleteMany(args)
  }
}
