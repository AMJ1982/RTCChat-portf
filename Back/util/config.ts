import dotenv from 'dotenv'
dotenv.config()

// Storing passwords and keys to variables.
export const TOKEN_SECRET = process.env.TOKEN_SECRET as string 
export const DB_PWD = process.env.DB_PWD as string
export const DEV_DB_PWD = process.env.DEV_DB_PWD as string
export const FLY_DB_PWD = process.env.FLY_DB_PWD as string
export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY as string
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY as string
export const VAPID_SUBJECT = process.env.VAPID_SUBJECT as string
export const DB_SIZE_LIMIT = process.env.NODE_ENV === 'test' ? 8 : 150
export const DB_NAME = process.env.NODE_ENV === 'test' ? 'rtcchat_test' : 'rtcchat'