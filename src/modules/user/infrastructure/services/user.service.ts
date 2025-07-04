import { Injectable } from '@nestjs/common'

import { User } from '../entities/User'
import { UpdateUserPayload } from '../interfaces/update-user-data'
import { UpdateUserData } from '../interfaces/update-user-payload'
import { UserRepository } from '../repositories/user.repository'

import { hashPassword } from '@/auth/infrastructure/utils/password'
import { UserNotFound } from '@/exceptions/index'

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async findByEmail(email: string) {
		const user = await this.userRepository.findByEmail(email)
		if (!user) throw new UserNotFound()

		return new User(user.email, user.name, user.phone, user.role)
	}

	async findById(id: string) {
		const user = await this.userRepository.findById(id)
		if (!user) throw new UserNotFound()

		return new User(user.email, user.name, user.phone, user.role)
	}

	async updateUserById(id: string, payload: Partial<UpdateUserPayload>) {
		const user = await this.userRepository.findById(id)
		if (!user) throw new UserNotFound()

		const updateData = await this.buildUpdateData(payload)

		const updated = await this.userRepository.updateById(id, updateData)
		if (!updated) throw new UserNotFound()

		return new User(updated.email, updated.name, updated.phone, updated.role)
	}

	async updateUserByEmail(email: string, payload: Partial<UpdateUserPayload>) {
		const user = await this.userRepository.findByEmail(email)
		if (!user) throw new UserNotFound()

		const updateData = await this.buildUpdateData(payload)

		const updated = await this.userRepository.updateUser(email, updateData)

		return new User(updated.email, updated.name, updated.phone, updated.role)
	}

	private async buildUpdateData(
		payload: Partial<UpdateUserPayload>
	): Promise<Partial<UpdateUserData>> {
		const updateData: Partial<UpdateUserData> = {
			email: payload.email,
			name: payload.name,
			phone: payload.phone
		}
		if (payload.password)
			updateData.hashPassword = await hashPassword(payload.password)

		return updateData
	}

	async deleteUserById(id: string) {
		const user = await this.userRepository.findById(id)
		if (!user) throw new UserNotFound()

		await this.userRepository.deleteById(id)
	}
}
