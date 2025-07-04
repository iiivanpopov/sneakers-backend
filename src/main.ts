import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { ExceptionsFilter } from './exceptions/http-exception.filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	)
	app.useGlobalFilters(new ExceptionsFilter())
	app.use(cookieParser())
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
