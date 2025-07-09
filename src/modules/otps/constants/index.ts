export const OTP_TTL = 2 * 60
export const RETRY_DELAY = 2 * 60
export const OTP_REDIS_KEY = (email: string) => `otp:${email}`
