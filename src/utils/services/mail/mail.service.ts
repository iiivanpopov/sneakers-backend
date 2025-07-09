import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

  async sendOtp(to: string, otp: number) {
    await this.mailer.sendMail({
      to,
      subject: 'Otp code',
      text: `${otp}`
    })
  }
}
