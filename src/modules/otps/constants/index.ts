export const OTP_TTL = 2 * 60
export const RETRY_DELAY = 2 * 60
export const RETRY_DELAY_LARGE = 5 * 60
export const OTP_REDIS_KEY = (email: string) => `otp:${email}`

export const COOKIES = {
  REFRESH: 'refreshToken'
} as const
