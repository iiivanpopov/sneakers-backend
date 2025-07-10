import { CanActivate, Injectable, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class ApiAuthGuard extends AuthGuard('jwt') {}

export const UseAuthGuard = (...otherGuards: (any | CanActivate)[]) =>
  UseGuards(ApiAuthGuard, ...otherGuards)
