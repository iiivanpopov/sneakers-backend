export const REDIS_KEYS = {
	OTP: (email: string) => `otp:${email}`
} as const
