import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'
import { BaseResolver } from '@/utils/services/base'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AdminGuard } from '@/utils/guards/admin.guard'
import { UseAuthGuard } from '@/utils/guards/auth.guard'
import { CreateDiscountDto } from '../dto/create-discount.dto'
import { UpdateDiscountDto } from '../dto/update-discount.dto'
import { SneakerDetailsResponse } from '../models/sneakers.model'
import { mapToSneakerDetails } from '../utils/mappers/mapToSneakerDetails'
import { DiscountService } from '../services/discount.service'

@Controller('sneakers')
export class DiscountController extends BaseResolver {
  constructor(private readonly discountService: DiscountService) {
    super()
  }

  @Post(':slug/discount')
  @ApiOperation({ summary: 'Create discount for sneaker' })
  @ApiResponse({ type: SneakerDetailsResponse })
  @ApiBody({ type: CreateDiscountDto })
  @UseAuthGuard(AdminGuard)
  async createDiscount(
    @Param('slug') slug: string,
    @Body() createDiscountDto: CreateDiscountDto
  ): Promise<SneakerDetailsResponse> {
    const updatedSneaker = await this.discountService.createDiscountForSneaker(
      slug,
      createDiscountDto
    )

    return this.wrapSuccess({
      data: mapToSneakerDetails(updatedSneaker)
    })
  }

  @Patch(':slug/discount')
  @ApiOperation({ summary: 'Update discount for sneaker' })
  @ApiResponse({ type: SneakerDetailsResponse })
  @ApiBody({ type: UpdateDiscountDto })
  @UseAuthGuard(AdminGuard)
  async updateDiscount(
    @Param('slug') slug: string,
    @Body() updateDiscountDto: UpdateDiscountDto
  ): Promise<SneakerDetailsResponse> {
    const updatedSneaker = await this.discountService.updateDiscountForSneaker(
      slug,
      updateDiscountDto
    )

    return this.wrapSuccess({
      data: mapToSneakerDetails(updatedSneaker)
    })
  }

  @Delete(':slug/discount')
  @ApiOperation({ summary: 'Delete discount for sneaker' })
  @ApiResponse({ type: SneakerDetailsResponse })
  @UseAuthGuard(AdminGuard)
  async deleteDiscount(
    @Param('slug') slug: string
  ): Promise<SneakerDetailsResponse> {
    const updatedSneaker =
      await this.discountService.deleteDiscountForSneaker(slug)

    return this.wrapSuccess({
      data: mapToSneakerDetails(updatedSneaker)
    })
  }
}
