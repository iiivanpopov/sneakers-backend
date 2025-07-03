import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'

import { CONFIG } from '../../constants/config'
import { AuthService } from '../../infrastructure/services/auth.service'
import { GetOtpDto } from '../dto/get-otp.dto'
import { LoginDto } from '../dto/login.dto'
import { RegisterDto } from '../dto/register.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('otp')
	async otp(@Body() body: GetOtpDto) {
		const otp = await this.authService.getOtp(body.email)

		return {
			message: 'Otp generated',
			otp,
			retryAt: Date.now() + CONFIG.retryDelay * 1000
		}
	}

	@Post('register')
	async register(
		@Body() body: RegisterDto,
		@Res({ passthrough: true }) response: Response
	) {
		const data = await this.authService.register(body)

		response.cookie('refreshToken', data.tokens.refreshToken)

		return { message: 'Successfully registered', ...data }
	}

	@Post('login')
	async login(
		@Body() body: LoginDto,
		@Res({ passthrough: true }) response: Response
	) {
		const data = await this.authService.login(body)

		response.cookie('refreshToken', data.tokens.refreshToken)

		return { message: 'Successfully logged in', ...data }
	}
}
