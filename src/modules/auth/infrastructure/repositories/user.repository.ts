import { Prisma } from '@generated/prisma'
import { Injectable } from '@nestjs/common'

import { CreateUserPayload } from '../interfaces/create-user-payload'
import { FindUniqueUserPayload } from '../interfaces/user-exists-payload'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(user: CreateUserPayload) {
		return this.prisma.user.create({
			data: user
		})
	}

	async startResetPassword(email: string) {
		return this.prisma.user.update({
			where: { email },
			data: { isPasswordReset: true }
		})
	}

	async resetPassword(email: string, hashPassword: string) {
		return this.prisma.user.update({
			where: { email },
			data: { isPasswordReset: false, hashPassword }
		})
	}

	async findByName(name: string) {
		return this.prisma.user.findMany({ where: { name } })
	}

	async findByEmail(email: string, params: Prisma.UserWhereInput = {}) {
		return this.prisma.user.findFirst({ where: { ...params, email } })
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
