import { AdminGuard } from '@/utils/guards/admin.guard'
import { UseAuthGuard } from '@/utils/guards/auth.guard'
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { AddStockDto } from '../dto/add-stock.dto'
import { BaseResolver } from '@/utils/services/base'
import { SneakerStockResponse, AddStockResponse } from '../models/stock.model'
import { SneakersService } from '../services/sneakers.service'
import { StockService } from '../services/stock.service'

@Controller('sneakers')
export class StockController extends BaseResolver {
  constructor(
    private readonly sneakersService: SneakersService,
    private readonly stockService: StockService
  ) {
    super()
  }

  @Get(':slug/stock')
  @ApiOperation({ summary: 'Stock by slug' })
  @ApiResponse({ type: SneakerStockResponse })
  async getStock(@Param('slug') slug: string): Promise<SneakerStockResponse> {
    const stockItems = await this.stockService.findMany({
      where: {
        sneaker: { slug }
      },
      orderBy: {
        size: 'asc'
      }
    })

    return this.wrapSuccess({
      data: stockItems
    })
  }

  @UseAuthGuard(AdminGuard)
  @Post(':slug/stock')
  @ApiOperation({ summary: 'Add stock to sneaker' })
  @ApiResponse({ type: AddStockResponse })
  @ApiBody({ type: AddStockDto })
  async addStock(
    @Param('slug') slug: string,
    @Body() addStockDto: AddStockDto
  ): Promise<AddStockResponse> {
    const sneaker = await this.sneakersService.findUnique({
      where: { slug }
    })

    if (!sneaker) {
      throw new NotFoundException('Sneaker not found')
    }

    const stockItem = await this.stockService.upsert({
      where: {
        sneakerId_size: {
          sneakerId: sneaker.id,
          size: addStockDto.size
        }
      },
      update: {
        quantity: {
          increment: addStockDto.quantity
        }
      },
      create: {
        sneakerId: sneaker.id,
        size: addStockDto.size,
        quantity: addStockDto.quantity
      }
    })

    return this.wrapSuccess({
      data: stockItem
    })
  }
}
