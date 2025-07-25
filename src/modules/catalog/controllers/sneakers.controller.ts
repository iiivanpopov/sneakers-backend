import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req
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
import { UseAuthGuard, UseOptionalAuthGuard } from '@/utils/guards/auth.guard'
import { AdminGuard } from '@/utils/guards/admin.guard'
import { SneakersService } from '../services/sneakers.service'
import { Request } from 'express'

@ApiTags('Sneakers')
@UseOptionalAuthGuard()
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
    @Req() req: Request,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('brandName') brandName?: string,
    @Query('hasDiscount') hasDiscount?: boolean,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number
  ): Promise<SneakersListResponse> {
    const userId = req.user?.id

    const sneakers = await this.sneakersService.getSneakers({
      offset,
      limit,
      brandName,
      hasDiscount,
      minPrice,
      maxPrice,
      userId
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
    @Req() req: Request,
    @Query('q') query: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ): Promise<SneakersSearchResponse> {
    const userId = req.user?.id
    const sneakers = await this.sneakersService.searchSneakers({
      query,
      userId,
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
    @Req() req: Request,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ): Promise<SneakersListResponse> {
    const userId = req.user?.id
    const sneakers = await this.sneakersService.getDiscountedSneakers({
      offset,
      limit,
      userId
    })

    return this.wrapSuccess({ data: sneakers })
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Sneaker details by slug' })
  @ApiResponse({ type: SneakerDetailsResponse })
  async getBySlug(
    @Param('slug') slug: string,
    @Req() req: Request
  ): Promise<SneakerDetailsResponse> {
    const userId = req.user?.id

    const sneaker = await this.sneakersService.getSneakerBySlug(slug, userId)

    if (!sneaker) {
      throw new NotFoundException('Sneaker not found')
    }

    return this.wrapSuccess({
      data: sneaker
    })
  }
}
