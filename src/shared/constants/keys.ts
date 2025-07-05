export const REDIS_KEYS = {
	OTP: (email: string) => `otp:${email}`,
	POPULAR_MODELS: 'popular:sneaker-models'
} as const

export const COOKIES_KEYS = {
	refreshToken: 'refreshToken'
} as const
