import 'dotenv/config'

export const Mongo_Db_URL = process.env.MONGO_DB  as string

export const JWT_SECRET = process.env.JWT_SECRET as string