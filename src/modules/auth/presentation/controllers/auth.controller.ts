import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Request, Response } from 'express'

import { AuthService } from '../../infrastructure/services/auth.service'
import { ForgotPasswordDTO } from '../dto/forgot-password.dto'
import { GetOTPDTO } from '../dto/get-otp.dto'
import { LoginDTO } from '../dto/login.dto'
import { RegisterDto } from '../dto/register.dto'
import { ResetPasswordDTO } from '../dto/reset-password.dto'

import configuration from '@/shared/config'
import { COOKIES_KEYS } from '@/shared/constants/keys'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		@Inject(configuration.KEY)
		private readonly config: ConfigType<typeof configuration>
	) {}

	@Post('otp')
	async otp(@Body() body: GetOTPDTO) {
		const otp = await this.authService.getOTP(body.email)

		return {
			message: 'OTP generated',
			otp,
			retryAt: Date.now() + this.config.otp.retryDelay * 1000
		}
	}

	@Post('register')
	async register(
		@Body() body: RegisterDto,
		@Res({ passthrough: true }) response: Response
	) {
		const data = await this.authService.register(body)

		response.cookie(COOKIES_KEYS.refreshToken, data.tokens.refreshToken, {
			maxAge: this.config.jwt.refreshCookieTTL,
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})

		return { message: 'Successfully registered', ...data }
	}

	@Post('login')
	async login(
		@Body() body: LoginDTO,
		@Res({ passthrough: true }) response: Response
	) {
		const data = await this.authService.login(body)

		response.cookie(COOKIES_KEYS.refreshToken, data.tokens.refreshToken, {
			maxAge: this.config.jwt.refreshCookieTTL,
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
			maxAge: this.config.jwt.refreshCookieTTL,
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})

		return { message: 'Successfully refreshed tokens', ...data }
	}

	@Post('forgot-password')
	async forgotPassword(@Body() body: ForgotPasswordDTO) {
		const otp = await this.authService.requestPasswordReset(body.email)

		return { message: 'Password reset requested successfully', otp }
	}

	@Post('password-reset')
	async passwordReset(@Body() body: ResetPasswordDTO) {
		await this.authService.resetPassword(body.email, body.otp, body.password)

		return { message: 'Password reset successfully' }
	}
}
