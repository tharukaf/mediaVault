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
import reviewRoutes from './server/routes/reviewRoutes.mjs'
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
console.log('Connecting to Redis session store...')
console.log(process.env.REDIS_PASSWORD, process.env.REDIS_HOST, process.env.REDIS_PORT)
redisClient.connect()
  .then(() => {
    console.log('Connected to Redis session store.')
  })
  .catch(err => {

    console.error('Error connecting to Redis session store:', err)
  })
let redisStore
try {
  redisStore = new RedisStore(redisStoreOptions(redisClient))
  sessionOptions.store = redisStore
  console.log('RedisStore initialized for session management.')
} catch (err) {
  console.error('Error initializing RedisStore:', err)
}

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
app.use('/reviews', reviewRoutes)
app.use('/', Routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
