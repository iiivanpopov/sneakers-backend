import { Role } from '@generated/prisma'

export class User {
	constructor(
		public readonly email: string,
		public readonly name: string,
		public readonly phone: string,
		public readonly role: Role,
		public readonly id: string
	) {}
}
