const configuration = () => ({
	port: parseInt(process.env.PORT) ?? 3000,

	otp: {
		retryDelay: 2 * 60 // 2m
	},

	jwt: {
		refreshCookieTTL: 7 * 24 * 60 * 60 * 1000, // 7d
		refreshTTL: '7d',
		jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,

		accessTTL: '15m',
		jwtAccessSecret: process.env.JWT_ACCESS_SECRET
	},

	redis: {
		redisHost: process.env.REDIS_HOST,
		redisPort: parseInt(process.env.REDIS_PORT)
	}
})

configuration.KEY = 'configuration.config'

export default configuration
