import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst<T extends Prisma.UserFindFirstArgs>(
    args: T
  ): Promise<Prisma.UserGetPayload<T> | null> {
    return this.prisma.user.findFirst(
      args
    ) as Promise<Prisma.UserGetPayload<T> | null>
  }

  async findUnique<T extends Prisma.UserFindUniqueArgs>(
    args: T
  ): Promise<Prisma.UserGetPayload<T> | null> {
    return this.prisma.user.findUnique(
      args
    ) as Promise<Prisma.UserGetPayload<T> | null>
  }

  async findMany<T extends Prisma.UserFindManyArgs>(
    args: T
  ): Promise<Prisma.UserGetPayload<T>[]> {
    return this.prisma.user.findMany(args) as Promise<
      Prisma.UserGetPayload<T>[]
    >
  }

  async create<T extends Prisma.UserCreateArgs>(
    args: T
  ): Promise<Prisma.UserGetPayload<T>> {
    return this.prisma.user.create(args) as unknown as Promise<
      Prisma.UserGetPayload<T>
    >
  }

  async update<T extends Prisma.UserUpdateArgs>(
    args: T
  ): Promise<Prisma.UserGetPayload<T>> {
    return this.prisma.user.update(args) as unknown as Promise<
      Prisma.UserGetPayload<T>
    >
  }

  async delete<T extends Prisma.UserDeleteArgs>(
    args: T
  ): Promise<Prisma.UserGetPayload<T>> {
    return this.prisma.user.delete(args) as unknown as Promise<
      Prisma.UserGetPayload<T>
    >
  }
}
