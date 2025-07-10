import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException
} from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthService } from '@/utils/services/auth'
import { BaseResolver, BaseResponse } from '@/utils/services/base'
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger'
import { SignInDto, UpdateProfileDto } from './dto'
import {
  RefreshResponse,
  SessionResponse,
  SignInResponse,
  UpdateProfileResponse
} from './users.model'
import { OtpsService } from '../otps'
import { Request, Response } from 'express'
import { TokenService } from '@/utils/services/auth/common/token/token.service'
import { UseAuthGuard } from '@/utils/guards/auth.guard'
import { mapToUserEntity } from './entities'
import { COOKIES } from './constants'

@Controller()
export class UsersController extends BaseResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly otpsService: OtpsService,
    private readonly tokenService: TokenService
  ) {
    super()
  }

  @Post('auth/signin')
  @ApiOperation({ summary: 'User sign-in with OTP code' })
  @ApiBody({
    type: SignInDto,
    description: 'Sign-in payload with email and OTP code'
  })
  @ApiResponse({
    status: 200,
    description: 'Successful sign-in returns access token',
    type: SignInResponse
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP code' })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<SignInResponse> {
    let user = await this.usersService.findFirst({
      where: { email: signInDto.email }
    })

    if (!user) {
      user = await this.usersService.create({
        data: { email: signInDto.email }
      })
    }

    const otp = await this.otpsService.findByEmail(signInDto.email)

    if (!otp || signInDto.code != otp.code) {
      throw new BadRequestException(this.wrapFail('Incorrect otp code'))
    }

    await this.otpsService.deleteByEmail(signInDto.email)
    const { accessToken, refreshToken } = await this.authService.authenticate({
      sub: user.id,
      role: user.role
    })

    await this.tokenService.upsert({
      where: {
        userId: user.id
      },
      update: {
        token: refreshToken
      },
      create: {
        userId: user.id,
        token: refreshToken
      }
    })

    res.cookie(COOKIES.REFRESH, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none'
    })

    return this.wrapSuccess({ accessToken })
  }

  @Post('auth/logout')
  @ApiOperation({ summary: 'Logout user and clear refresh token cookie' })
  @ApiResponse({
    status: 200,
    description: 'Successful logout',
    type: BaseResponse
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid refresh token' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<BaseResponse> {
    const cookieRefreshToken = req.cookies[COOKIES.REFRESH]
    if (!cookieRefreshToken)
      throw new UnauthorizedException(this.wrapFail('Missing refresh token'))

    await this.tokenService.delete({
      where: {
        token: cookieRefreshToken
      }
    })
    res.clearCookie(COOKIES.REFRESH)

    return this.wrapSuccess()
  }

  @Post('auth/refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access token',
    type: RefreshResponse
  })
  @ApiResponse({ status: 401, description: 'Missing or revoked refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<RefreshResponse> {
    const cookieRefreshToken = req.cookies[COOKIES.REFRESH]
    if (!cookieRefreshToken)
      throw new UnauthorizedException(this.wrapFail('Missing refresh token'))

    const tokenRecord = await this.tokenService.findUnique({
      where: { token: cookieRefreshToken },
      include: {
        user: {
          select: {
            role: true
          }
        }
      }
    })
    if (!tokenRecord)
      throw new UnauthorizedException(this.wrapFail('Refresh token revoked'))

    const { accessToken, refreshToken } = await this.authService.authenticate({
      sub: tokenRecord.userId,
      role: tokenRecord.user.role
    })

    await this.tokenService.update({
      where: { token: cookieRefreshToken },
      data: { token: refreshToken }
    })

    res.cookie(COOKIES.REFRESH, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none'
    })

    return this.wrapSuccess({ accessToken })
  }

  @Get('/session')
  @UseAuthGuard()
  @ApiHeader({
    name: 'authorization'
  })
  @ApiResponse({
    status: 200,
    description: 'get user session',
    type: SessionResponse
  })
  @ApiOperation({ summary: 'Get user session' })
  @ApiBearerAuth()
  async getUserSession(@Req() req: Request): Promise<SessionResponse> {
    const user = await this.usersService.findFirst({
      where: { id: req.user?.userId }
    })

    if (!user) {
      throw new BadRequestException(this.wrapFail('User does not exists'))
    }

    return this.wrapSuccess({ user: mapToUserEntity(user) })
  }

  @Patch('/profile')
  @UseAuthGuard()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'update profile',
    type: UpdateProfileResponse
  })
  @ApiHeader({
    name: 'authorization'
  })
  @ApiBearerAuth()
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<UpdateProfileResponse> {
    const user = await this.usersService.findFirst({
      where: { email: updateProfileDto.email }
    })

    if (!user) {
      throw new BadRequestException(this.wrapFail('User does not exists'))
    }

    await this.usersService.update({
      where: { email: user.email },
      data: {
        firstName: updateProfileDto.profile.firstName,
        lastName: updateProfileDto.profile.lastName,
        middleName: updateProfileDto.profile.middleName,
        email: updateProfileDto.profile.email,
        city: updateProfileDto.profile.city
      }
    })

    return this.wrapSuccess({
      user: mapToUserEntity(user)
    })
  }
}
