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
import { CreateSneakerModelDTO } from '../dto/create-sneaker-model.dto'
import { UpdateSneakerModelDTO } from '../dto/update-sneaker-model.dto'

import { User } from '@/auth/domain/entities/User'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import { Roles } from '@/shared/decorators/roles.decorator'
import { RolesGuard } from '@/shared/guards/roles/roles.guard'
import { JwtAuthGuard } from '@/token/jwt/jwt.guard'
import { OptionalJwtAuthGuard } from '@/token/jwt/optional.jwt.guard'

@Controller('/sneakers')
export class SneakerModelsController {
	constructor(private readonly sneakersModelService: SneakersModelService) {}

	@Get()
	@UseGuards(OptionalJwtAuthGuard)
	async getSneakerModels(
		@Query('offset') offset = 0,
		@Query('limit') limit = 10,
		@CurrentUser() optionalUser?: User
	) {
		const data = await this.sneakersModelService.getSneakerModels(
			Number(offset),
			Number(limit),
			optionalUser
		)
		return { message: 'Fetched sneakers successfully', sneakers: data }
	}

	@Get('/search')
	@UseGuards(OptionalJwtAuthGuard)
	async searchSneakerModels(
		@Query('offset') offset = 0,
		@Query('limit') limit = 10,
		@Query('q') search: string,
		@CurrentUser() optionalUser?: User
	) {
		const data = await this.sneakersModelService.searchSneakers(
			Number(offset),
			Number(limit),
			search,
			optionalUser
		)
		return { message: 'Fetched sneakers successfully', sneakers: data }
	}

	@Get('/popular')
	async getPopularModels() {
		const data = await this.sneakersModelService.getPopularModels()
		return {
			message: 'Fetched popular sneaker models successfully',
			sneakers: data
		}
	}

	@Get('/brands')
	async getSneakerBrands() {
		const data = await this.sneakersModelService.getSneakerBrands()
		return { message: 'Fetched sneaker brands successfully', brands: data }
	}

	@Get('/:slug')
	@UseGuards(OptionalJwtAuthGuard)
	async getSneakerModel(
		@Param('slug') slug: string,
		@CurrentUser() optionalUser?: User
	) {
		const data = await this.sneakersModelService.getSneakerModel(
			slug,
			optionalUser
		)
		return { message: 'Fetched sneaker successfully', sneaker: data }
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
			message: 'Updated sneaker model successfully',
			sneaker: data,
			success: true
		}
	}
}
