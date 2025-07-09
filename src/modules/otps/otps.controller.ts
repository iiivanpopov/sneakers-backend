import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common'
import { OtpsService } from './otps.service'
import { BaseResolver } from '@/utils/services/base'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { OTP_TTL, RETRY_DELAY } from './constants'
import { OtpResponse } from './otps.model'
import { CreateOtpDto } from './dto/create-otp.dto'
import { randomInt } from 'crypto'
import { MailService } from '@/utils/services/mail/mail.service'

@Controller()
export class OtpsController extends BaseResolver {
  constructor(
    private readonly otpsService: OtpsService,
    private readonly mailService: MailService
  ) {
    super()
  }

  @Post('/auth/otp')
  @ApiOperation({ summary: 'OTP code generation' })
  @ApiResponse({
    status: 200,
    description: 'create otp',
    type: OtpResponse
  })
  async createOtp(@Body() createOtpDto: CreateOtpDto): Promise<OtpResponse> {
    const existingOtp = await this.otpsService.findByEmail(createOtpDto.email)

    if (existingOtp) {
      const now = new Date().getTime()

      if (existingOtp.retryAt > now) {
        return this.wrapSuccess({
          retryAt: existingOtp.retryAt
        })
      }
    }
    const code = randomInt(100_000, 1_000_000)
    const retryAt = Date.now() + RETRY_DELAY * 1000
    await this.otpsService.create(
      {
        email: createOtpDto.email,
        code,
        retryAt
      },
      OTP_TTL
    )

    await this.mailService.sendOtp(createOtpDto.email, code)

    return this.wrapSuccess({ retryAt })
  }

  @Get('/auth/otp/:email')
  @ApiOperation({ summary: 'OTP status' })
  @ApiResponse({
    status: 200,
    description: 'otp status',
    type: OtpResponse
  })
  async getOtpStatus(@Param('email') email: string): Promise<OtpResponse> {
    const existingOtp = await this.otpsService.findByEmail(email)

    if (!existingOtp) {
      throw new NotFoundException(this.wrapFail('Otp not found'))
    }

    return this.wrapSuccess({
      retryAt: existingOtp.retryAt
    })
  }
}
