import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Request, Response } from 'express'
import configuration from 'src/config'

import { AuthService } from '../../infrastructure/services/auth.service'
import { ForgotPasswordDTO } from '../dto/forgot-password.dto'
import { GetOTPDTO } from '../dto/get-otp.dto'
import { LoginDTO } from '../dto/login.dto'
import { RegisterDto } from '../dto/register.dto'
import { ResetPasswordDTO } from '../dto/reset-password.dto'

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
			success: true,
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

		response.cookie(COOKIES_KEYS.REFRESH_TOKEN, data.tokens.refreshToken, {
			maxAge: this.config.jwt.refreshCookieTTL,
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})

		return { success: true, message: 'Successfully registered', ...data }
	}

	@Post('login')
	async login(
		@Body() body: LoginDTO,
		@Res({ passthrough: true }) response: Response
	) {
		const data = await this.authService.login(body)

		response.cookie(COOKIES_KEYS.REFRESH_TOKEN, data.tokens.refreshToken, {
			maxAge: this.config.jwt.refreshCookieTTL,
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})

		return { success: true, message: 'Successfully logged in', ...data }
	}

	@Post('logout')
	async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response
	) {
		const refreshToken = request.cookies[COOKIES_KEYS.REFRESH_TOKEN]

		await this.authService.logout(refreshToken)

		response.clearCookie(COOKIES_KEYS.REFRESH_TOKEN)

		return { success: true, message: 'Successfully logged out' }
	}

	@Post('refresh')
	async refresh(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response
	) {
		const refreshToken = request.cookies[COOKIES_KEYS.REFRESH_TOKEN]

		const data = await this.authService.refresh(refreshToken)

		response.cookie(COOKIES_KEYS.REFRESH_TOKEN, data.tokens.refreshToken, {
			maxAge: this.config.jwt.refreshCookieTTL,
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		})

		return { success: true, message: 'Successfully refreshed tokens', ...data }
	}

	@Post('forgot-password')
	async forgotPassword(@Body() body: ForgotPasswordDTO) {
		const otp = await this.authService.requestPasswordReset(body.email)

		return {
			success: true,
			message: 'Password reset requested successfully',
			otp
		}
	}

	@Post('password-reset')
	async passwordReset(@Body() body: ResetPasswordDTO) {
		await this.authService.resetPassword(body.email, body.otp, body.password)

		return { success: true, message: 'Password reset successfully' }
	}
}
