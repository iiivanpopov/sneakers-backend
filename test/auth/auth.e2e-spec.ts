import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as dotenv from 'dotenv'
import * as request from 'supertest'

import { AppModule } from '../../src/app.module'

dotenv.config({ path: '../../.env.test.local' })

describe('AuthController (e2e)', () => {
	let app: INestApplication
	const prefix = '/api'
	const dataPrefix = crypto.randomUUID()

	const testEmail = `${dataPrefix}test@example.com`
	const testUser = {
		email: testEmail,
		name: `${dataPrefix}testuser`,
		phone: `${dataPrefix}123`,
		password: `${dataPrefix}securePass123`
	}

	let otpCode: string

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile()

		app = moduleFixture.createNestApplication()
		app.setGlobalPrefix(prefix)
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true
			})
		)

		await app.init()
	})

	afterAll(async () => {
		await app.close()
	})

	it('/auth/otp (POST) → 201', async () => {
		const response = await request(app.getHttpServer())
			.post(`${prefix}/auth/otp`)
			.send({ email: testEmail })
			.expect(201)

		expect(response.body).toHaveProperty('otp')
		expect(response.body).toHaveProperty('retryAt')
		expect(response.body.otp).toMatch(/^\d+$/) // numeric OTP
		expect(new Date(response.body.retryAt)).toBeInstanceOf(Date)

		otpCode = response.body.otp
	})

	it('/auth/register (POST) → 201', async () => {
		const response = await request(app.getHttpServer())
			.post(`${prefix}/auth/register`)
			.send({
				user: testUser,
				otp: otpCode
			})

		console.log(response)
		// .expect(201)

		expect(response.body.message).toBe('Successfully registered')
		expect(response.body).toHaveProperty('tokens.accessToken')
		expect(response.body).toHaveProperty('user.email', testEmail)
		expect(response.body).toHaveProperty('user.name', testUser.name)
		expect(response.body.user).not.toHaveProperty('password')

		const cookies = response.headers['set-cookie']
		expect(cookies).toBeDefined()
		expect(cookies[0]).toMatch(/refreshToken=/)
	})

	it('/auth/login (POST) → 201', async () => {
		const otpRes = await request(app.getHttpServer())
			.post(`${prefix}/auth/otp`)
			.send({ email: testEmail })
			.expect(201)

		const otp = otpRes.body.otp

		const response = await request(app.getHttpServer())
			.post(`${prefix}/auth/login`)
			.send({
				identifier: testEmail,
				otp
			})
			.expect(201)

		expect(response.body.message).toBe('Successfully logged in')
		expect(response.body).toHaveProperty('tokens.accessToken')
		expect(response.body).toHaveProperty('user.email', testEmail)
		expect(response.body.user).not.toHaveProperty('password')

		const cookies = response.headers['set-cookie']
		expect(cookies).toBeDefined()
		expect(cookies[0]).toMatch(/refreshToken=/)
	})
})
