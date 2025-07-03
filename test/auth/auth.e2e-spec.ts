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

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile()

		app = moduleFixture.createNestApplication()
		app.setGlobalPrefix(prefix)
		app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
		await app.init()
	})

	const testEmail = dataPrefix + 'test@example.com'
	const testUser = {
		email: testEmail,
		name: dataPrefix + 'testuser',
		phone: dataPrefix + '123',
		password: dataPrefix + 'securePass123'
	}
	let otpCode: string

	it('/auth/otp (POST) → 201', async () => {
		const res = await request(app.getHttpServer())
			.post(`${prefix}/auth/otp`)
			.send({ email: testEmail })

		expect(res.status).toBe(201)

		expect(res.body).toHaveProperty('otp')
		expect(res.body).toHaveProperty('retryAt')
		otpCode = res.body.otp
	})

	it('/auth/register (POST) → 201', async () => {
		const res = await request(app.getHttpServer())
			.post(`${prefix}/auth/register`)
			.send({
				user: testUser,
				otp: otpCode
			})

		expect(res.status).toBe(201)

		expect(res.body.message).toBe('Successfully registered')
		expect(res.body).toHaveProperty('tokens.accessToken')
		expect(res.body).toHaveProperty('user.email', testEmail)
		expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=/)
	})

	it('/auth/login (POST) → 201', async () => {
		const otpRes = await request(app.getHttpServer())
			.post(`${prefix}/auth/otp`)
			.send({ email: testEmail })

		expect(otpRes.status).toBe(201)

		const otp = otpRes.body.otp

		const res = await request(app.getHttpServer())
			.post(`${prefix}/auth/login`)
			.send({
				identifier: testEmail,
				otp
			})

		expect(res.status).toBe(201)
		expect(res.body.message).toBe('Successfully logged in')
		expect(res.body).toHaveProperty('tokens.accessToken')
		expect(res.body).toHaveProperty('user.email', testEmail)
		expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=/)
	})

	afterAll(async () => {
		await app.close()
	})
})
