import 'dotenv/config'
import mongoose from 'mongoose'
import RedisStore from 'connect-redis'
import { createClient } from 'redis'

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING

//  connectToMongo
export async function connectToMongo() {
  let a = await mongoose.connect(mongoConnectionString)
}

//  connectToRedis
export async function connectToRedis() {
  let redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: 19439,
    },
  })
  redisClient.connect().catch(console.error)
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myapp:',
  })
  return redisStore
}
