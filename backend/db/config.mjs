import 'dotenv/config'
import mongoose from 'mongoose'

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING

export default async function connectToMongo() {
  let a = await mongoose.connect(mongoConnectionString)
}

//  connectToMongo
