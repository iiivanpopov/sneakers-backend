import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import configuration from './config'
import { AuthModule } from './modules/auth/auth.module'
import { CartModule } from './modules/cart/cart.module'
import { FavoritesModule } from './modules/favorites/favorites.module'
import { SneakersModule } from './modules/sneakers/sneakers.module'
import { UserModule } from './modules/user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true
		}),
		AuthModule,
		UserModule,
		SneakersModule,
		FavoritesModule,
		CartModule
	]
})
export class AppModule {}
