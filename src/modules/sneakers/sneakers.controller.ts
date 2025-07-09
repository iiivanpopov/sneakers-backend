import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  SneakersListResponse,
  SneakersSearchResponse,
  PopularSneakersResponse,
  BrandsResponse,
  SneakerDetailsResponse,
  SneakerStockResponse,
  SneakerItem,
  mapToSneakerItem,
  mapToSearchResult,
  SearchResult,
  PopularSneaker,
  mapToPopularSneaker,
  mapToBrand,
  mapToSneakerDetails,
  mapToStockItem,
  StockItem
} from './sneakers.model'
import { BaseResolver } from '@/utils/services/base'
import { BrandsService } from './services/brands.service'
import { StockService } from './services/stock.service'
import { SneakersService } from './services/sneakers.service'

@ApiTags('Sneakers')
@Controller('sneakers')
export class SneakersController extends BaseResolver {
  constructor(
    private readonly sneakersService: SneakersService,
    private readonly brandsService: BrandsService,
    private readonly stockService: StockService
  ) {
    super()
  }

  @Get()
  @ApiOperation({ summary: 'Sneakers list' })
  @ApiResponse({ type: SneakersListResponse })
  async getAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ): Promise<SneakersListResponse> {
    const sneakers = await this.sneakersService.findSneakerMany({
      take: parseInt(limit ?? '10', 10),
      skip: parseInt(offset ?? '0', 10),
      include: {
        brand: {
          select: {
            name: true
          }
        }
      }
    })

    const mappedSneakers: SneakerItem[] = sneakers.map(sneaker =>
      mapToSneakerItem({ ...sneaker, brandName: sneaker.brand.name })
    )

    return this.wrapSuccess({ data: mappedSneakers })
  }

  @Get('search')
  @ApiOperation({ summary: 'Search sneakers' })
  @ApiResponse({ type: SneakersSearchResponse })
  async search(
    @Query('q') q: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ): Promise<SneakersSearchResponse> {
    if (!q || q.trim().length === 0) {
      return this.wrapSuccess({ data: [] })
    }

    const sneakers = await this.sneakersService.findSneakerMany({
      take: parseInt(limit || '10', 10),
      skip: parseInt(offset || '0', 10),
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
          {
            brand: {
              is: {
                name: { contains: q, mode: 'insensitive' }
              }
            }
          }
        ]
      },
      include: {
        brand: {
          select: {
            name: true
          }
        }
      }
    })

    const mappedSneakers: SearchResult[] = sneakers.map(sneaker =>
      mapToSearchResult({ ...sneaker, brandName: sneaker.brand.name })
    )

    return this.wrapSuccess({
      data: mappedSneakers
    })
  }

  @Get('popular')
  @ApiOperation({ summary: 'Popular sneakers' })
  @ApiResponse({ type: PopularSneakersResponse })
  async getPopular(): Promise<PopularSneakersResponse> {
    const sneakers = await this.sneakersService.findSneakerMany({
      take: 50,
      include: {
        popularity: {
          select: {
            purchases: true,
            views: true
          }
        }
      },
      orderBy: {
        popularity: {
          purchases: 'desc'
        }
      }
    })

    const mappedSneakers: PopularSneaker[] = sneakers.map(sneaker =>
      mapToPopularSneaker({
        ...sneaker,
        views: sneaker.popularity?.views ?? 0,
        purchases: sneaker.popularity?.purchases ?? 0
      })
    )

    return this.wrapSuccess({ data: mappedSneakers })
  }

  @Get('brands')
  @ApiOperation({ summary: 'Brands list' })
  @ApiResponse({ type: BrandsResponse })
  async getBrands(): Promise<BrandsResponse> {
    const brands = await this.brandsService.findBrandMany({
      orderBy: { name: 'asc' }
    })

    const mappedBrands = brands.map(brand => mapToBrand(brand))

    return this.wrapSuccess({ data: mappedBrands })
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Sneaker details by slug' })
  @ApiResponse({ type: SneakerDetailsResponse })
  async getBySlug(
    @Param('slug') slug: string
  ): Promise<SneakerDetailsResponse> {
    const sneaker = await this.sneakersService.findSneakerUnique({
      where: {
        slug
      },
      include: {
        brand: {
          select: {
            name: true
          }
        }
      }
    })

    if (!sneaker) {
      throw new NotFoundException('Sneaker not found')
    }

    return this.wrapSuccess({
      data: mapToSneakerDetails({ ...sneaker, brandName: sneaker.brand.name })
    })
  }

  @Get(':slug/stock')
  @ApiOperation({ summary: 'Stock buy slug' })
  @ApiResponse({ type: SneakerStockResponse })
  async getStock(@Param('slug') slug: string): Promise<SneakerStockResponse> {
    const stockItems = await this.stockService.findStockMany({
      where: {
        sneaker: { slug }
      }
    })

    const mappedStockItems: StockItem[] = stockItems.map(item =>
      mapToStockItem(item)
    )

    return this.wrapSuccess({
      data: mappedStockItems
    })
  }
}
