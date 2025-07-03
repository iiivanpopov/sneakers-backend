export const REDIS_KEYS = {
	OTP: (email: string) => `otp:${email}`
} as const

export const COOKIES_KEYS = {
	refreshToken: 'refreshToken'
} as const
