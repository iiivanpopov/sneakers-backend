import { Injectable } from '@nestjs/common'

import { CreateUserPayload } from '../interfaces/create-user-payload'
import { FindUniqueUserPayload } from '../interfaces/user-exists-payload'
import { hashPassword } from '../utils/password'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create({ password, name, email, phone }: CreateUserPayload) {
		const hash = await hashPassword(password)

		return this.prisma.user.create({
			data: {
				name,
				email,
				phone,
				hashPassword: hash
			}
		})
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
