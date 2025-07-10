import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger'
import {
  SneakersListResponse,
  SneakersSearchResponse,
  SneakerDetailsResponse,
  CreateSneakerResponse
} from '../models/sneakers.model'
import { BaseResolver } from '@/utils/services/base'
import { CreateSneakerDto } from '../dto/create-sneaker.dto'
import { UseAuthGuard } from '@/utils/guards/auth.guard'
import { AdminGuard } from '@/utils/guards/admin.guard'
import { SneakersService } from '../services/sneakers.service'

@ApiTags('Sneakers')
@Controller('sneakers')
export class SneakersController extends BaseResolver {
  constructor(private readonly sneakersService: SneakersService) {
    super()
  }

  @Get()
  @ApiOperation({ summary: 'Sneakers list' })
  @ApiResponse({ type: SneakersListResponse })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'brandId', required: false, type: String })
  @ApiQuery({ name: 'hasDiscount', required: false, type: Boolean })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  async getAll(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('brandName') brandName?: string,
    @Query('hasDiscount') hasDiscount?: boolean,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number
  ): Promise<SneakersListResponse> {
    const sneakers = await this.sneakersService.getSneakers({
      offset,
      limit,
      brandName,
      hasDiscount,
      minPrice,
      maxPrice
    })

    return this.wrapSuccess({ data: sneakers })
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sneaker' })
  @ApiResponse({ type: CreateSneakerResponse })
  @ApiBody({ type: CreateSneakerDto })
  @UseAuthGuard(AdminGuard)
  async create(
    @Body() createSneakerDto: CreateSneakerDto
  ): Promise<CreateSneakerResponse> {
    const sneaker = await this.sneakersService.createSneaker(createSneakerDto)

    return this.wrapSuccess({
      data: sneaker
    })
  }

  @Get('search')
  @ApiOperation({ summary: 'Search sneakers' })
  @ApiResponse({ type: SneakersSearchResponse })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  async search(
    @Query('q') query: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ): Promise<SneakersSearchResponse> {
    const sneakers = await this.sneakersService.searchSneakers({
      query,
      offset,
      limit
    })

    return this.wrapSuccess({
      data: sneakers
    })
  }

  @Get('discounted')
  @ApiOperation({ summary: 'Get sneakers with active discounts' })
  @ApiResponse({ type: SneakersListResponse })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  async getDiscounted(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ): Promise<SneakersListResponse> {
    const sneakers = await this.sneakersService.getDiscountedSneakers({
      offset,
      limit
    })

    return this.wrapSuccess({ data: sneakers })
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Sneaker details by slug' })
  @ApiResponse({ type: SneakerDetailsResponse })
  async getBySlug(
    @Param('slug') slug: string
  ): Promise<SneakerDetailsResponse> {
    const sneaker = await this.sneakersService.getSneakerBySlug(slug)

    if (!sneaker) {
      throw new NotFoundException('Sneaker not found')
    }

    return this.wrapSuccess({
      data: sneaker
    })
  }
}
