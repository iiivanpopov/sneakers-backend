import { BaseResolver } from '@/utils/services/base'
import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { BrandsResponse } from '../models/brands.model'
import { BrandsService } from '../services/brands.service'

@ApiTags('Brands')
@Controller('brands')
export class BrandsController extends BaseResolver {
  constructor(private readonly brandsService: BrandsService) {
    super()
  }

  @Get()
  @ApiOperation({ summary: 'Brands list' })
  @ApiResponse({ type: BrandsResponse })
  async getBrands(): Promise<BrandsResponse> {
    const brands = await this.brandsService.findMany({
      orderBy: { name: 'asc' }
    })

    return this.wrapSuccess({ data: brands })
  }
}
