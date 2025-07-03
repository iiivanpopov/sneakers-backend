import { User } from '@generated/prisma'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class TokenRepository {
	constructor(private readonly prisma: PrismaService) {}

	async upsertToken(user: User, refreshToken: string) {
		await this.prisma.token.upsert({
			where: { userId: user.id },
			update: { refreshToken },
			create: {
				userId: user.id,
				refreshToken
			}
		})
	}

	async deleteToken(refreshToken: string) {
		await this.prisma.token.delete({ where: { refreshToken } })
	}
}
