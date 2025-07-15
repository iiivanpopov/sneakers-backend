import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException
} from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { BaseResolver } from '@/utils/services/base'
import { GetFavoritesResponse } from './favorites.model'
import { UseAuthGuard } from '@/utils/guards/auth.guard'
import { Request } from 'express'
import { SneakersService } from '../catalog'
import { mapToSneakerDetails } from '../catalog/utils/mappers/mapToSneakerDetails'
import { SneakerDetails } from '../catalog/entities/sneaker.entity'

@ApiTags('Favorites')
@UseAuthGuard()
@Controller('favorites')
export class FavoritesController extends BaseResolver {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly sneakersService: SneakersService
  ) {
    super()
  }

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiResponse({ type: GetFavoritesResponse })
  async getFavorites(@Req() req: Request): Promise<GetFavoritesResponse> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException(this.wrapFail())

    const favorites = await this.favoritesService.findMany({
      where: { userId },
      include: {
        sneaker: {
          include: {
            brand: true,
            popularity: true,
            discount: true
          }
        }
      }
    })

    const sneakers = favorites.map(f =>
      mapToSneakerDetails({
        ...f.sneaker,
        isFavored: true
      })
    )

    return this.wrapSuccess({ data: sneakers })
  }

  @Post(':slug')
  @ApiOperation({ summary: 'Add sneaker to favorites' })
  @ApiResponse({ type: SneakerDetails })
  async addToFavorite(
    @Param('slug') slug: string,
    @Req() req: Request
  ): Promise<SneakerDetails> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException(this.wrapFail())

    const sneaker = await this.sneakersService.findUnique({
      where: { slug },
      include: {
        brand: true,
        popularity: true,
        discount: true
      }
    })

    if (!sneaker)
      throw new NotFoundException(this.wrapFail('Sneaker not found'))

    await this.favoritesService.create({
      data: {
        sneakerId: sneaker.id,
        userId
      }
    })

    return this.wrapSuccess(
      mapToSneakerDetails({
        ...sneaker,
        isFavored: true
      })
    )
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Remove sneaker from favorites' })
  @ApiResponse({ type: SneakerDetails })
  async deleteFrom(
    @Param('slug') slug: string,
    @Req() req: Request
  ): Promise<SneakerDetails> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException(this.wrapFail())

    const sneaker = await this.sneakersService.findUnique({
      where: { slug },
      include: {
        brand: true,
        popularity: true,
        discount: true
      }
    })

    if (!sneaker)
      throw new NotFoundException(this.wrapFail('Sneaker not found'))

    await this.favoritesService.delete({
      where: {
        sneakerId: sneaker.id,
        userId
      }
    })

    return this.wrapSuccess(
      mapToSneakerDetails({
        ...sneaker,
        isFavored: false // Removed from favorites
      })
    )
  }
}
