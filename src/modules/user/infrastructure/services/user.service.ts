import { Injectable } from '@nestjs/common'

import { User } from '../entities/User'
import { UpdateUserPayload } from '../interfaces/update-user-data'
import { UpdateUserData } from '../interfaces/update-user-payload'
import { UserRepository } from '../repositories/user.repository'

import { hashPassword } from '@/auth/infrastructure/utils/password'

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async findByEmail(email: string) {
		const user = await this.userRepository.findByEmail(email)
		return new User(user.email, user.name, user.phone, user.role)
	}

	async updateUser(email: string, payload: Partial<UpdateUserPayload>) {
		const updateData: Partial<UpdateUserData> = {
			email: payload.email,
			name: payload.name,
			phone: payload.phone
		}
		if (payload.password) {
			updateData.hashPassword = await hashPassword(payload.password)
		}

		const user = await this.userRepository.updateUser(email, updateData)
		return new User(user.email, user.name, user.phone, user.role)
	}
}
