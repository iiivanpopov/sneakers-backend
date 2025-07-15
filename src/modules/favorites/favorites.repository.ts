import { Prisma } from '@/prisma'
import { PrismaService } from '@/utils/services/prisma'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FavoritesRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findUnique<T extends Prisma.FavoriteItemFindUniqueArgs>(
    args: T
  ): Promise<Prisma.FavoriteItemGetPayload<T> | null> {
    return this.prisma.favoriteItem.findUnique(
      args
    ) as unknown as Promise<Prisma.FavoriteItemGetPayload<T> | null>
  }

  async findFirst<T extends Prisma.FavoriteItemFindFirstArgs>(
    args: T
  ): Promise<Prisma.FavoriteItemGetPayload<T> | null> {
    return this.prisma.favoriteItem.findFirst(
      args
    ) as unknown as Promise<Prisma.FavoriteItemGetPayload<T> | null>
  }

  async findMany<T extends Prisma.FavoriteItemFindManyArgs>(
    args: T
  ): Promise<Prisma.FavoriteItemGetPayload<T>[]> {
    return this.prisma.favoriteItem.findMany(args) as unknown as Promise<
      Prisma.FavoriteItemGetPayload<T>[]
    >
  }

  async create<T extends Prisma.FavoriteItemCreateArgs>(
    args: T
  ): Promise<Prisma.FavoriteItemGetPayload<T>> {
    return this.prisma.favoriteItem.create(args) as unknown as Promise<
      Prisma.FavoriteItemGetPayload<T>
    >
  }

  async update<T extends Prisma.FavoriteItemUpdateArgs>(
    args: T
  ): Promise<Prisma.FavoriteItemGetPayload<T>> {
    return this.prisma.favoriteItem.update(args) as unknown as Promise<
      Prisma.FavoriteItemGetPayload<T>
    >
  }

  async upsert<T extends Prisma.FavoriteItemUpsertArgs>(
    args: T
  ): Promise<Prisma.FavoriteItemGetPayload<T>> {
    return this.prisma.favoriteItem.upsert(args) as unknown as Promise<
      Prisma.FavoriteItemGetPayload<T>
    >
  }

  async delete<T extends Prisma.FavoriteItemDeleteArgs>(
    args: T
  ): Promise<Prisma.FavoriteItemGetPayload<T>> {
    return this.prisma.favoriteItem.delete(args) as unknown as Promise<
      Prisma.FavoriteItemGetPayload<T>
    >
  }

  async deleteMany<T extends Prisma.FavoriteItemDeleteManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.favoriteItem.deleteMany(args)
  }

  async updateMany<T extends Prisma.FavoriteItemUpdateManyArgs>(
    args: T
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.favoriteItem.updateMany(args)
  }
}
