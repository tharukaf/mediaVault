import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectToMongo from './db/config.mjs'
import Routes from './server/routes/searchRoutes.mjs'
import { igdbAuth, spotifyAuth } from './server/utility/apiAuth.mjs'
import { Book, Movie, Game, Music, TvShow } from './db/models/dbModels.mjs'
import sha256 from 'js-sha256'
import { createUser } from './db/models/userModel.mjs'
import helmet from 'helmet'
import RateLimit from 'express-rate-limit'
import {
  getUserByEmail,
  addMediaItemToUser,
  getSameMediaTypeItemsFromUser,
} from './db/models/userModel.mjs'
import cookieParser from 'cookie-parser'
import session from 'express-session'

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many requests',
  headers: true,
})

connectToMongo()

const PORT = 8000
const app = express()

app.use(limiter)
app.use(helmet())
app.use(cors())

app.use(cookieParser())
app.use(
  session({ secret: 'thisisakey', resave: false, saveUninitialized: false })
)

// Authenticate IGDB & Spotify APIs
app.use(['/search/games/:query', '/games/:id'], igdbAuth)
app.use(['/search/music/:query', '/music/:id'], spotifyAuth)

// Router middleware
app.use('/', Routes)

app.get('/viewcount', (req, res) => {
  req.session.views = req.session.views ? req.session.views + 1 : 1
  res.send(`Views: ${req.session.user}`)
})

app.use(['/users', '/login'], express.json())

// create user route
app.post('/users', async (req, res) => {
  const userData = req.body
  userData._id = sha256(userData.email)
  userData.password = sha256(userData.password)
  console.log(userData)
  createUser(userData, res)
})

// login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await getUserByEmail(email)
  if (user.password === sha256(password)) {
    req.session.user = user.id
    res.status(200).send(`Login successful ${req.session.user}`)
  } else {
    res.sendStatus(401)
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('Session destroyed')
  })
  res.status(200).send('Logout successful')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
