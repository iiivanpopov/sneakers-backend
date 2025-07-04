import { Injectable } from '@nestjs/common'

import { UpdateUserData } from '../interfaces/update-user-payload'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } })
	}

	async updateUser(email: string, payload: Partial<UpdateUserData>) {
		return this.prisma.user.update({ where: { email }, data: payload })
	}

	async findById(id: string) {
		return this.prisma.user.findUnique({ where: { id } })
	}

	async updateById(id: string, data: Partial<UpdateUserData>) {
		return this.prisma.user.update({
			where: { id },
			data
		})
	}

	async deleteById(id: string) {
		await this.prisma.user.delete({ where: { id } })
	}
}
