import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

import { CONFIG } from '../../constants/config'
import { COOKIES_KEYS } from '../../constants/keys'
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

		response.cookie(COOKIES_KEYS.refreshToken, data.tokens.refreshToken, {
			maxAge: parseInt(process.env.COOKIE_TTL),
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})

		return { message: 'Successfully registered', ...data }
	}

	@Post('login')
	async login(
		@Body() body: LoginDto,
		@Res({ passthrough: true }) response: Response
	) {
		const data = await this.authService.login(body)

		response.cookie(COOKIES_KEYS.refreshToken, data.tokens.refreshToken, {
			maxAge: parseInt(process.env.COOKIE_TTL),
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})

		return { message: 'Successfully logged in', ...data }
	}

	@Post('logout')
	async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response
	) {
		const refreshToken = request.cookies[COOKIES_KEYS.refreshToken]

		await this.authService.logout(refreshToken)

		response.clearCookie(COOKIES_KEYS.refreshToken)

		return { message: 'Successfully logged out' }
	}

	@Post('refresh')
	async refresh(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response
	) {
		const refreshToken = request.cookies[COOKIES_KEYS.refreshToken]

		const data = await this.authService.refresh(refreshToken)

		response.cookie(COOKIES_KEYS.refreshToken, data.tokens.refreshToken, {
			maxAge: parseInt(process.env.COOKIE_TTL),
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})

		return { message: 'Successfully refreshed tokens', ...data }
	}
}
