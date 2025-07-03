import { Injectable } from '@nestjs/common'

import { CreateUserPayload } from '../interfaces/create-user-payload'
import { FindUniqueUserPayload } from '../interfaces/user-exists-payload'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(payload: CreateUserPayload) {
		return this.prisma.user.create({ data: payload })
	}

	async findByName(name: string) {
		return this.prisma.user.findMany({ where: { name } })
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } })
	}

	async findByRefreshToken(refreshToken: string) {
		return this.prisma.user.findFirst({ where: { token: { refreshToken } } })
	}

	async existsUnique({ phone, email }: FindUniqueUserPayload) {
		return this.prisma.user.findFirst({
			where: { OR: [{ email }, { phone }] }
		})
	}
}
