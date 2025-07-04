import { Role } from '@generated/prisma'
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'

import { SneakersService } from '../../infrastructure/services/sneakers.service'
import { CreateSneakerModelDTO } from '../dto/create-sneaker-model.dto'

import { Roles } from '@/shared/decorators/roles.decorator'
import { RolesGuard } from '@/shared/guards/roles/roles.guard'
import { JwtAuthGuard } from '@/token/jwt/jwt.guard'

@Controller('/sneakers')
export class SneakersController {
	constructor(private readonly sneakersService: SneakersService) {}

	@Get()
	async getSneakers(@Query('offset') offset = 0, @Query('limit') limit = 10) {
		const data = await this.sneakersService.getSneakers(
			Number(offset),
			Number(limit)
		)

		return { message: 'Fetched sneakers successfully', sneakers: data }
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles([Role.MANAGER, Role.ADMIN])
	async createSneakerModel(@Body() body: CreateSneakerModelDTO) {
		const data = await this.sneakersService.createSneakerModel(body)

		return {
			message: 'Created sneaker model successfully',
			sneaker: data,
			success: true
		}
	}
}
