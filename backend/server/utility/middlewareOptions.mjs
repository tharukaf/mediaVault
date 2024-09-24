import dotenv from 'dotenv'

export const CorsOptions = {
  origin: 'http://localhost:5173',
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
