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
// app.use(cors())

app.use(function (req, res, next) {
  // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  // allows cookie to be sent
  res.header('Access-Control-Allow-Credentials', true)
  // you must specify the methods used with credentials. "*" will not work.
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, DELETE')
  next()
})

app.use(
  session({ secret: 'thisisakey', resave: false, saveUninitialized: false })
)
app.use(cookieParser('thisisakey'))

// Authenticate IGDB & Spotify APIs
app.use(['/search/games/:query', '/games/:id'], igdbAuth)
app.use(['/search/music/:query', '/music/:id'], spotifyAuth)

// Router middleware
app.use('/', Routes)

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
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  // const { email, password } = req.body.userForm
  const { email, password } = req.body
  const user = await getUserByEmail(email)
  if (user.password === sha256(password)) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
  console.log(email, password)
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
  console.log('from home: ', req.session.email)
  res.send('ok')
})

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('Session destroyed')
  })
  res.status(200).send('Logout successful')
  // // res.session.user = undefined
  // // console.log(req.signedCookies.email)
  // console.log('signed', req.signedCookies.email)
  // res.send(req.cookies.email)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
