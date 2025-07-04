import { Role } from '@generated/prisma'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	UseGuards
} from '@nestjs/common'

import { User } from '../../infrastructure/entities/User'
import { UserService } from '../../infrastructure/services/user.service'
import { UpdateUserDTO } from '../dto/update-user.dto'

import { CurrentUser } from '@/shared/decorators/current-user.decorator'
import { Roles } from '@/shared/decorators/roles.decorator'
import { RolesGuard } from '@/shared/guards/roles.guard'
import { JwtAuthGuard } from '@/token/jwt.guard'

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/')
	async getUser(@CurrentUser() user: User) {
		const data = await this.userService.findByEmail(user.email)

		return { message: 'Fetched user successfully', user: data }
	}

	@Patch('/')
	async updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDTO) {
		const data = this.userService.updateUserByEmail(user.email, body)

		return { message: 'Updated user successfully', user: data }
	}

	@Get('/:id')
	@Roles([Role.MANAGER, Role.ADMIN])
	async getUserById(@Param('id') id: string) {
		const user = await this.userService.findById(id)

		return { message: 'Fetched user successfully', user }
	}

	@Patch('/:id')
	@Roles([Role.MANAGER, Role.ADMIN])
	async updateUserById(@Param('id') id: string, @Body() body: UpdateUserDTO) {
		const user = await this.userService.updateUserById(id, body)

		return { message: 'Updated user successfully', user }
	}

	@Delete('/:id')
	@Roles([Role.MANAGER, Role.ADMIN])
	async deleteUserById(@Param('id') id: string) {
		await this.userService.deleteUserById(id)

		return { message: 'Deleted user successfully', success: true }
	}
}
