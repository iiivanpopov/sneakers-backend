import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst<T extends Prisma.RefreshTokenFindFirstArgs>(
    args: T
  ): Promise<Prisma.RefreshTokenGetPayload<T> | null> {
    return this.prisma.refreshToken.findFirst(
      args
    ) as Promise<Prisma.RefreshTokenGetPayload<T> | null>
  }

  async findUnique<T extends Prisma.RefreshTokenFindUniqueArgs>(
    args: T
  ): Promise<Prisma.RefreshTokenGetPayload<T> | null> {
    return this.prisma.refreshToken.findUnique(
      args
    ) as Promise<Prisma.RefreshTokenGetPayload<T> | null>
  }

  async findMany<T extends Prisma.RefreshTokenFindManyArgs>(
    args: T
  ): Promise<Prisma.RefreshTokenGetPayload<T>[]> {
    return this.prisma.refreshToken.findMany(args) as Promise<
      Prisma.RefreshTokenGetPayload<T>[]
    >
  }

  async create<T extends Prisma.RefreshTokenCreateArgs>(
    args: T
  ): Promise<Prisma.RefreshTokenGetPayload<T>> {
    return this.prisma.refreshToken.create(args) as unknown as Promise<
      Prisma.RefreshTokenGetPayload<T>
    >
  }

  async update<T extends Prisma.RefreshTokenUpdateArgs>(
    args: T
  ): Promise<Prisma.RefreshTokenGetPayload<T>> {
    return this.prisma.refreshToken.update(args) as unknown as Promise<
      Prisma.RefreshTokenGetPayload<T>
    >
  }

  async upsert<T extends Prisma.RefreshTokenUpsertArgs>(
    args: T
  ): Promise<Prisma.RefreshTokenGetPayload<T>> {
    return this.prisma.refreshToken.upsert(args) as unknown as Promise<
      Prisma.RefreshTokenGetPayload<T>
    >
  }

  async delete<T extends Prisma.RefreshTokenDeleteArgs>(
    args: T
  ): Promise<Prisma.RefreshTokenGetPayload<T>> {
    return this.prisma.refreshToken.delete(args) as unknown as Promise<
      Prisma.RefreshTokenGetPayload<T>
    >
  }
}
