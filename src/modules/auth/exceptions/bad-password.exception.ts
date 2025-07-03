import { UnauthorizedException } from '@nestjs/common'

export class BadPassword extends UnauthorizedException {
	constructor(message = 'Bad password') {
		super(message)
	}
}
