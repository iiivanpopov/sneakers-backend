declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      DATABASE_URL: string
      REDIS_URL: string

      JWT_ACCESS_SECRET: string
      JWT_REFRESH_SECRET: string

      LIQPAY_PUBLIC: string
      LIQPAY_PRIVATE: string

      SMTP_HOST: string
      SMTP_PORT: string
      SMTP_USER: string
      SMTP_PASS: string
    }
  }
}

export {}
