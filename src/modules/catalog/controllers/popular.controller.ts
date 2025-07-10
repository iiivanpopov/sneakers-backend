import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { SneakersRepository } from '../repositories/sneakers.repository'
import { BaseResolver } from '@/utils/services/base'
import { PopularSneakersResponse } from '../models/popular.model'
import { SneakerDetails } from '../entities/sneaker.entity'
import { mapToSneakerDetails } from '../utils/mappers/mapToSneakerDetails'

@Controller()
export class PopularController extends BaseResolver {
  constructor(private readonly sneakersService: SneakersRepository) {
    super()
  }

  @Get('popular')
  @ApiOperation({ summary: 'Popular sneakers' })
  @ApiResponse({ type: PopularSneakersResponse })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  async getPopular(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
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

    const mappedSneakers: SneakerDetails[] = sneakers.map(mapToSneakerDetails)

    return this.wrapSuccess({ data: mappedSneakers })
  }
}
