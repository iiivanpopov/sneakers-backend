import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { SneakersRepository } from '../repositories/sneakers.repository'
import { BaseResolver } from '@/utils/services/base'
import { PopularSneakersResponse } from '../models/popular.model'
import { SneakerDetails } from '../entities/sneaker.entity'
import { mapToSneakerDetails } from '../utils/mappers/mapToSneakerDetails'
import { FavoritesService } from '@/modules/favorites/favorites.service'

@Controller()
export class PopularController extends BaseResolver {
  constructor(
    private readonly sneakersService: SneakersRepository,
    private readonly favoritesService: FavoritesService
  ) {
    super()
  }

  private async getUserFavorites(userId?: string): Promise<string[]> {
    if (!userId) return []
    const favorites = await this.favoritesService.findMany({
      where: { userId },
      select: { sneakerId: true }
    })
    return favorites.map(fav => fav.sneakerId)
  }

  @Get('popular')
  @ApiOperation({ summary: 'Popular sneakers' })
  @ApiResponse({ type: PopularSneakersResponse })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  async getPopular(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string
  ): Promise<PopularSneakersResponse> {
    const sneakers = await this.sneakersService.findMany({
      take: parseInt(limit || '10', 10),
      skip: parseInt(offset || '0', 10),
      include: {
        popularity: true,
        brand: true,
        discount: true
      },
      orderBy: {
        popularity: {
          purchases: 'desc'
        }
      }
    })

    const userFavoredIds = await this.getUserFavorites(userId)

    const mappedSneakers: SneakerDetails[] = sneakers.map(sneaker =>
      mapToSneakerDetails({
        ...sneaker,
        isFavored: userFavoredIds.includes(sneaker.id)
      })
    )

    return this.wrapSuccess({ data: mappedSneakers })
  }
}
