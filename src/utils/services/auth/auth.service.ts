import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async verifyRefresh(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET
    })
  }

  async verifyAccess(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET
    })
  }

  async authenticate(user: { sub: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m'
      }),
      this.jwtService.signAsync(user, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d'
      })
    ])

    return { accessToken, refreshToken }
  }
}
