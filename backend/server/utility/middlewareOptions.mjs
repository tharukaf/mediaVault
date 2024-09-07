import dotenv from 'dotenv'

export function CorsOptions(req, res, next) {
  // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  // allows cookie to be sent
  res.header('Access-Control-Allow-Credentials', true)
  // you must specify the methods used with credentials. "*" will not work.
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, DELETE')
  next()
}

export const RateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many requests',
  headers: true,
}

export const sessionOptions = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}
