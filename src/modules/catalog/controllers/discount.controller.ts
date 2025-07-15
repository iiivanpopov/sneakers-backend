import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req
} from '@nestjs/common'
import { BaseResolver } from '@/utils/services/base'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AdminGuard } from '@/utils/guards/admin.guard'
import { UseAuthGuard } from '@/utils/guards/auth.guard'
import { CreateDiscountDto } from '../dto/create-discount.dto'
import { UpdateDiscountDto } from '../dto/update-discount.dto'
import { SneakerDetailsResponse } from '../models/sneakers.model'
import { mapToSneakerDetails } from '../utils/mappers/mapToSneakerDetails'
import { DiscountService } from '../services/discount.service'
import { FavoritesService } from '@/modules/favorites/favorites.service'
import { Request } from 'express'
import { UnauthorizedException } from '@nestjs/common'

@Controller('sneakers')
export class DiscountController extends BaseResolver {
  constructor(
    private readonly discountService: DiscountService,
    private readonly favoritesService: FavoritesService
  ) {
    super()
  }

  private async getUserFavorites(userId: string): Promise<string[]> {
    const favorites = await this.favoritesService.findMany({
      where: { userId },
      select: { sneakerId: true }
    })
    return favorites.map(fav => fav.sneakerId)
  }

  @Post(':slug/discount')
  @ApiOperation({ summary: 'Create discount for sneaker' })
  @ApiResponse({ type: SneakerDetailsResponse })
  @ApiBody({ type: CreateDiscountDto })
  @UseAuthGuard(AdminGuard)
  async createDiscount(
    @Param('slug') slug: string,
    @Body() createDiscountDto: CreateDiscountDto,
    @Req() req: Request
  ): Promise<SneakerDetailsResponse> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException()

    const updatedSneaker = await this.discountService.createDiscountForSneaker(
      slug,
      createDiscountDto
    )

    const userFavoredIds = await this.getUserFavorites(userId)

    return this.wrapSuccess({
      data: mapToSneakerDetails({
        ...updatedSneaker,
        isFavored: userFavoredIds.includes(updatedSneaker.id)
      })
    })
  }

  @Patch(':slug/discount')
  @ApiOperation({ summary: 'Update discount for sneaker' })
  @ApiResponse({ type: SneakerDetailsResponse })
  @ApiBody({ type: UpdateDiscountDto })
  @UseAuthGuard(AdminGuard)
  async updateDiscount(
    @Param('slug') slug: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
    @Req() req: Request
  ): Promise<SneakerDetailsResponse> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException()

    const updatedSneaker = await this.discountService.updateDiscountForSneaker(
      slug,
      updateDiscountDto
    )

    const userFavoredIds = await this.getUserFavorites(userId)

    return this.wrapSuccess({
      data: mapToSneakerDetails({
        ...updatedSneaker,
        isFavored: userFavoredIds.includes(updatedSneaker.id)
      })
    })
  }

  @Delete(':slug/discount')
  @ApiOperation({ summary: 'Delete discount for sneaker' })
  @ApiResponse({ type: SneakerDetailsResponse })
  @UseAuthGuard(AdminGuard)
  async deleteDiscount(
    @Param('slug') slug: string,
    @Req() req: Request
  ): Promise<SneakerDetailsResponse> {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException()

    const updatedSneaker =
      await this.discountService.deleteDiscountForSneaker(slug)

    const userFavoredIds = await this.getUserFavorites(userId)

    return this.wrapSuccess({
      data: mapToSneakerDetails({
        ...updatedSneaker,
        isFavored: userFavoredIds.includes(updatedSneaker.id)
      })
    })
  }
}
