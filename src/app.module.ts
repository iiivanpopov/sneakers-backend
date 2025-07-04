import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import configuration from './shared/config'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true
		}),
		AuthModule,
		UserModule
	]
})
export class AppModule {}
