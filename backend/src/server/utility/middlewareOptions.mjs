import 'dotenv/config'

export const CorsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
}

export const RateLimitOptions = {
  windowMs: 1 * 60 * 1000,
  max: 200,
  message: 'Too many requests',
  standardHeaders: 'draft-7',
}

export const sessionOptions = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}

export const redisClientOptions = {
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
}

export let redisStoreOptions = redisClient => ({
  client: redisClient,
  prefix: 'myapp:',
})
