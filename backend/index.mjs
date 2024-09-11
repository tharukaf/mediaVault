import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import sha256 from 'js-sha256'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import RateLimit from 'express-rate-limit'
import connectToMongo from './db/config.mjs'
import Routes from './server/routes/searchRoutes.mjs'
import { igdbAuth, spotifyAuth } from './server/utility/apiAuth.mjs'
import { createUser } from './db/models/userModel.mjs'
import { getUserByEmail } from './db/models/userModel.mjs'
import {
  CorsOptions,
  RateLimitOptions,
  sessionOptions,
} from './server/utility/middlewareOptions.mjs'

const limiter = RateLimit(RateLimitOptions)

connectToMongo()

const PORT = 8000
const app = express()

app.use(limiter)
app.use(helmet())

app.use(cors())
app.use(CorsOptions)
app.use(session(sessionOptions))
app.use(cookieParser(sessionOptions.secret))

app.use(express.json())

// Authenticate IGDB & Spotify APIs
app.use(['/search/games/:query', '/games/:id'], igdbAuth)
app.use(['/search/music/:query', '/music/:id'], spotifyAuth)

// Router middleware
app.use('/', Routes)

// create user route
app.post('/users', async (req, res) => {
  const userData = req.body
  userData._id = sha256(userData.email)
  userData.password = sha256(userData.password)
  createUser(userData, res)
})

// login route
app.post('/login', async (req, res) => {
  // res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  const { email, password } = req.body
  const user = await getUserByEmail(email)
  if (user === null) {
    res.status(404).send('User not found')
  }
  if (user.password === sha256(password)) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

app.get('/cookie/refresh/:email', async (req, res) => {
  const { email } = req.params
  const user = await getUserByEmail(email)
  // res.send(`Views: ${req.session.views}`)
  req.session.email = user.email
  req.session.name = user.name
  res.cookie('email', `${user.email}`)
  res.cookie('name', `${user.name}`)
  res.json({
    name: req.session.name,
    email: req.session.email,
    token: user._id,
  })
})

app.get('/userdata', (req, res) => {
  // console.log('from home: ', req.session.email)
  res.send('ok')
})

app.post('/logout', (req, res) => {
  req.session.destroy()
  res.status(200).send('Logout successful')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
