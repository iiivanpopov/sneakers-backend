import { BadRequestException, Injectable } from '@nestjs/common'
import { SneakersRepository } from '../repositories/sneakers.repository'
import { CreateSneakerDto } from '../dto/create-sneaker.dto'
import { SneakerDetails } from '../entities/sneaker.entity'
import { mapToSneakerDetails } from '../utils/mappers/mapToSneakerDetails'
import { BrandsService } from './brands.service'
import { PopularityService } from './popularity.service'
import { PrismaService } from '@/utils/services/prisma'
import { FavoritesService } from '@/modules/favorites/favorites.service'

interface GetSneakersOptions {
  offset?: string
  limit?: string
  brandName?: string
  hasDiscount?: boolean
  minPrice?: number
  maxPrice?: number
  userId?: string
}

interface SearchSneakersOptions {
  query: string
  offset?: string
  limit?: string
  userId?: string
}

interface GetDiscountedSneakersOptions {
  offset?: string
  limit?: string
  userId?: string
}

@Injectable()
export class SneakersService extends SneakersRepository {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly brandsService: BrandsService,
    private readonly favoritesService: FavoritesService,
    private readonly popularityService: PopularityService
  ) {
    super(prisma)
  }

  private async getUserFavorites(userId?: string): Promise<string[]> {
    if (!userId) return []
    const favorites = await this.favoritesService.findMany({
      where: { userId },
      select: { sneakerId: true }
    })
    return favorites.map(fav => fav.sneakerId)
  }

  async getSneakers(options: GetSneakersOptions): Promise<SneakerDetails[]> {
    const whereClause: any = {}

    if (options.brandName) {
      whereClause.brand = {}
      whereClause.brand.name = options.brandName
    }

    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      whereClause.price = {}
      if (options.minPrice !== undefined)
        whereClause.price.gte = options.minPrice
      if (options.maxPrice !== undefined)
        whereClause.price.lte = options.maxPrice
    }

    if (options.hasDiscount !== undefined) {
      if (options.hasDiscount) {
        whereClause.discount = {
          isNot: null,
          is: {
            OR: [
              { startsAt: { lte: new Date() }, endsAt: { gte: new Date() } },
              { startsAt: null, endsAt: null },
              { startsAt: { lte: new Date() }, endsAt: null },
              { startsAt: null, endsAt: { gte: new Date() } }
            ]
          }
        }
      } else {
        whereClause.discount = null
      }
    }

    const sneakers = await this.findMany({
      take: parseInt(options.limit ?? '10', 10),
      skip: parseInt(options.offset ?? '0', 10),
      where: whereClause,
      include: {
        popularity: true,
        brand: true,
        discount: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const userFavoredIds = await this.getUserFavorites(options.userId)

    return sneakers.map(sneaker =>
      mapToSneakerDetails({
        ...sneaker,
        isFavored: userFavoredIds.includes(sneaker.id)
      })
    )
  }

  async createSneaker(
    createSneakerDto: CreateSneakerDto
  ): Promise<SneakerDetails> {
    let brand = await this.brandsService.findUnique({
      where: { name: createSneakerDto.brandName }
    })

    if (!brand) {
      brand = await this.brandsService.create({
        data: {
          name: createSneakerDto.brandName,
          logo: createSneakerDto.brandLogoUrl
        }
      })
    }

    const existingSneaker = await this.findUnique({
      where: { slug: createSneakerDto.slug }
    })

    if (existingSneaker) {
      throw new BadRequestException('Sneaker with this slug already exists')
    }

    const existingPopularity = await this.popularityService.create({
      data: {}
    })

    const sneaker = await this.create({
      data: {
        name: createSneakerDto.name,
        slug: createSneakerDto.slug,
        description: createSneakerDto.description,
        price: createSneakerDto.price,
        images: createSneakerDto.images,
        popularityId: existingPopularity.id,
        brandId: brand.id
      },
      include: {
        popularity: true,
        brand: true,
        discount: true
      }
    })

    return mapToSneakerDetails({
      ...sneaker,
      isFavored: false
    })
  }

  async searchSneakers(
    options: SearchSneakersOptions
  ): Promise<SneakerDetails[]> {
    if (!options.query || options.query.trim().length === 0) {
      return []
    }

    const sneakers = await this.findMany({
      take: parseInt(options.limit || '10', 10),
      skip: parseInt(options.offset || '0', 10),
      where: {
        OR: [
          { name: { contains: options.query, mode: 'insensitive' } },
          { slug: { contains: options.query, mode: 'insensitive' } },
          {
            brand: {
              is: {
                name: { contains: options.query, mode: 'insensitive' }
              }
            }
          }
        ]
      },
      include: {
        brand: true,
        popularity: true,
        discount: true
      }
    })

    if (
      sneakers.length === 1 &&
      (sneakers[0].name === options.query || sneakers[0].slug === options.query)
    ) {
      await this.popularityService.incrementViews(sneakers[0].id)
    }

    const userFavoredIds = await this.getUserFavorites(options.userId)

    return sneakers.map(sneaker =>
      mapToSneakerDetails({
        ...sneaker,
        isFavored: userFavoredIds.includes(sneaker.id)
      })
    )
  }

  async getDiscountedSneakers(
    options: GetDiscountedSneakersOptions
  ): Promise<SneakerDetails[]> {
    const now = new Date()

    const sneakers = await this.findMany({
      take: parseInt(options.limit || '10', 10),
      skip: parseInt(options.offset || '0', 10),
      where: {
        discount: {
          OR: [
            { startsAt: { lte: now }, endsAt: { gte: now } },
            { startsAt: null, endsAt: null },
            { startsAt: { lte: now }, endsAt: null },
            { startsAt: null, endsAt: { gte: now } }
          ]
        }
      },
      include: {
        popularity: true,
        brand: true,
        discount: true
      },
      orderBy: {
        discount: {
          percent: 'desc'
        }
      }
    })

    const userFavoredIds = await this.getUserFavorites(options.userId)

    return sneakers.map(sneaker =>
      mapToSneakerDetails({
        ...sneaker,
        isFavored: userFavoredIds.includes(sneaker.id)
      })
    )
  }

  async getSneakerBySlug(
    slug: string,
    userId?: string
  ): Promise<SneakerDetails | null> {
    const sneaker = await this.findUnique({
      where: {
        slug
      },
      include: {
        brand: true,
        discount: true,
        popularity: true
      }
    })

    if (!sneaker) {
      return null
    }

    await this.popularityService.incrementViews(sneaker.id)

    const userFavoredIds = await this.getUserFavorites(userId)

    return mapToSneakerDetails({
      ...sneaker,
      isFavored: userFavoredIds.includes(sneaker.id)
    })
  }
}
