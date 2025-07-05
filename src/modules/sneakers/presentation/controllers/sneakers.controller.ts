import { Role } from '@generated/prisma'
import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common'

import { SneakersService } from '../../infrastructure/services/sneakers.service'
import { CreateSneakerDTO } from '../dto/create-sneaker.dto'
import { UpdateSneakersDTO } from '../dto/update-sneakers.dto'

import { Roles } from '@/shared/decorators/roles.decorator'
import { RolesGuard } from '@/shared/guards/roles/roles.guard'
import { JwtAuthGuard } from '@/token/jwt/jwt.guard'

@Controller('/sneakers')
export class SneakersController {
	constructor(private readonly sneakersService: SneakersService) {}

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

	@Patch('/:slug/stock')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles([Role.MANAGER, Role.ADMIN])
	async updateSneakers(
		@Param('slug') slug: string,
		@Body() body: UpdateSneakersDTO
	) {
		const data = await this.sneakersService.updateSneakers(slug, body)

		return {
			message: 'Updated sneakers successfully',
			sneakers: data,
			success: true
		}
	}
}
