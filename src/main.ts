import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as fs from 'fs'
import * as path from 'path'
import { ValidationPipe } from '@nestjs/common'
import { Response } from 'express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      cert: fs.readFileSync(path.resolve(__dirname, '../credentials/cert.crt')),
      key: fs.readFileSync(path.resolve(__dirname, '../credentials/key.key'))
    },
    cors: {
      origin: '*'
    }
  })
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  app.use('/live', (_req, res: Response) => {
    res.json({ status: true })
  })

  const apiConfig = new DocumentBuilder()
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    })
    .build()

  const document = SwaggerModule.createDocument(app, apiConfig)
  SwaggerModule.setup('api', app, document)

  const port = process.env.PORT ?? 3000
  await app.listen(port)

  console.log(`Application is running on: ${await app.getUrl()}`)
}
void bootstrap()
