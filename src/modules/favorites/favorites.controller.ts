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
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { BaseResolver } from '@/utils/services/base'
import {
  AddToFavoriteResponse,
  GetFavoritesResponse,
  RemoveFromFavoriteResponse
} from './favorites.model'
import { UseAuthGuard } from '@/utils/guards/auth.guard'
import { Request } from 'express'
import { SneakersService } from '../catalog'
import { mapToSneakerDetails } from '../catalog/utils/mappers/mapToSneakerDetails'

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
            popularity: true
          }
        }
      }
    })

    const sneakers = favorites.map(f => mapToSneakerDetails(f.sneaker))

    return this.wrapSuccess({ data: sneakers })
  }

  @Post(':slug')
  @ApiResponse({ type: AddToFavoriteResponse })
  async addToFavorite(
    @Param('slug') slug: string,
    @Req() req: Request
  ): Promise<AddToFavoriteResponse> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException(this.wrapFail())

    const sneaker = await this.sneakersService.findUnique({
      where: {
        slug
      }
    })

    if (!sneaker)
      throw new NotFoundException(this.wrapFail('Sneaker not found'))

    await this.favoritesService.create({
      data: {
        sneakerId: sneaker?.id,
        userId
      }
    })

    return this.wrapSuccess()
  }

  @Delete(':slug')
  @ApiResponse({ type: RemoveFromFavoriteResponse })
  async deleteFrom(@Param('slug') slug: string, @Req() req: Request) {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException(this.wrapFail())

    const sneaker = await this.sneakersService.findUnique({
      where: {
        slug
      }
    })

    if (!sneaker)
      throw new NotFoundException(this.wrapFail('Sneaker not found'))

    await this.favoritesService.delete({
      where: {
        sneakerId: sneaker?.id,
        userId
      }
    })

    return this.wrapSuccess()
  }
}
