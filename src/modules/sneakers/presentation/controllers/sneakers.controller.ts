import { Role } from '@generated/prisma'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards
} from '@nestjs/common'

import { SneakersModelService } from '../../infrastructure/services/sneaker-models.service'
import { SneakersService } from '../../infrastructure/services/sneakers.service'
import { CreateSneakerModelDTO } from '../dto/create-sneaker-model.dto'
import { CreateSneakerDTO } from '../dto/create-sneaker.dto'
import { UpdateSneakerModelDTO } from '../dto/update-sneaker-model.dto'

import { Roles } from '@/shared/decorators/roles.decorator'
import { RolesGuard } from '@/shared/guards/roles/roles.guard'
import { JwtAuthGuard } from '@/token/jwt/jwt.guard'

@Controller('/sneakers')
export class SneakersController {
	constructor(
		private readonly sneakersModelService: SneakersModelService,
		private readonly sneakersService: SneakersService
	) {}

	@Get()
	async getSneakerModels(
		@Query('offset') offset = 0,
		@Query('limit') limit = 10
	) {
		const data = await this.sneakersModelService.getSneakers(
			Number(offset),
			Number(limit)
		)

		return { message: 'Fetched sneakers successfully', sneakers: data }
	}

	@Get('/:slug')
	async getSneakerModel(@Param('slug') slug) {
		const data = await this.sneakersModelService.getSneakerBySlug(slug)

		return { message: 'Fetched sneaker successfully', sneaker: data }
	}

	@Get('/search')
	async searchSneakerModels(
		@Query('offset') offset = 0,
		@Query('limit') limit = 10,
		@Query('q') search: string
	) {
		const data = await this.sneakersModelService.searchSneakers(
			Number(offset),
			Number(limit),
			search
		)

		return { message: 'Fetched sneakers successfully', sneakers: data }
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles([Role.MANAGER, Role.ADMIN])
	async createSneakerModel(@Body() body: CreateSneakerModelDTO) {
		const data = await this.sneakersModelService.createSneakerModel(body)

		return {
			message: 'Created sneaker model successfully',
			sneaker: data,
			success: true
		}
	}

	@Delete('/:slug')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles([Role.MANAGER, Role.ADMIN])
	async deleteSneakerModel(@Param('slug') slug: string) {
		const data = await this.sneakersModelService.deleteSneakerModel(slug)

		return {
			message: 'Deleted sneaker model successfully',
			sneaker: data,
			success: true
		}
	}

	@Patch('/:slug')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles([Role.MANAGER, Role.ADMIN])
	async updateSneakerModel(
		@Param('slug') slug: string,
		@Body() body: UpdateSneakerModelDTO
	) {
		const data = await this.sneakersModelService.updateSneakerModel(slug, body)

		return {
			message: 'Deleted sneaker model successfully',
			sneaker: data,
			success: true
		}
	}

	@Get('/:slug/stock')
	async getSneakers(@Param('slug') slug: string) {
		const data = await this.sneakersService.getSneakers(slug)

		return {
			message: 'Fetched sneakers successfully',
			sneaker: data
		}
	}

	@Post('/:slug/stock')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles([Role.MANAGER, Role.ADMIN])
	async createSneaker(
		@Param('slug') slug: string,
		@Body() body: CreateSneakerDTO
	) {
		const data = await this.sneakersService.createSneaker(slug, body)

		return {
			message: 'Created sneaker successfully',
			sneaker: data,
			success: true
		}
	}
}
