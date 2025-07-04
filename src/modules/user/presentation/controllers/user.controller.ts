import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'

import { User } from '../../infrastructure/entities/User'
import { UserService } from '../../infrastructure/services/user.service'
import { UpdateUserDTO } from '../dto/update-user.dto'

import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/token/jwt.guard'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/')
	async getUser(@CurrentUser() user: User) {
		return this.userService.findByEmail(user.email)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/')
	async updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDTO) {
		return this.userService.updateUser(user.email, body)
	}
}
