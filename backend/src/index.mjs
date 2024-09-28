import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import RateLimit from 'express-rate-limit'
import { connectToMongo } from './db/config.mjs'
import { createClient } from 'redis'
import RedisStore from 'connect-redis'
import Routes from './server/routes/searchRoutes.mjs'
import userRoutes from './server/routes/userRoutes.mjs'
import { igdbAuth, spotifyAuth } from './server/utility/apiAuth.mjs'
import {
  CorsOptions,
  RateLimitOptions,
  sessionOptions,
  redisClientOptions,
  redisStoreOptions,
} from './server/utility/middlewareOptions.mjs'

const limiter = RateLimit(RateLimitOptions)

connectToMongo()

const redisClient = createClient(redisClientOptions)
redisClient.connect().catch(console.error)
const redisStore = new RedisStore(redisStoreOptions(redisClient))
sessionOptions.store = redisStore

const PORT = process.env.PORT || 8000
const app = express()

app.use(limiter)
app.use(helmet())
app.use(cors(CorsOptions))

app.use(session(sessionOptions))
app.use(cookieParser(sessionOptions.secret))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Base Route')
})

// Authenticate IGDB & Spotify APIs
app.use(
  ['/search/games/:query', '/games/:id', '/curator', '/getReleaseDate'],
  igdbAuth
)
app.use(['/search/music/:query', '/music/:id', '/curator'], spotifyAuth)

// Router middleware
app.use('/', userRoutes)
app.use('/', Routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
