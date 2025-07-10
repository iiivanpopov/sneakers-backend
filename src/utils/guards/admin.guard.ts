import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { PrismaService } from '../services/prisma'
import { Role } from '@/prisma'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (user?.role !== Role.ADMIN) {
      return false
    }

    return true
  }
}
