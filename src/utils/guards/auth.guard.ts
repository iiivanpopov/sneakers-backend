import { CanActivate, Injectable, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class ApiAuthGuard extends AuthGuard('jwt') {}

export const UseAuthGuard = (...otherGuards: (any | CanActivate)[]) =>
  UseGuards(ApiAuthGuard, ...otherGuards)

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    return user || null
  }
}

export const UseOptionalAuthGuard = (...otherGuards: (any | CanActivate)[]) =>
  UseGuards(JwtOptionalAuthGuard, ...otherGuards)
