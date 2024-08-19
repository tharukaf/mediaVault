import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectToMongo from './db/config.mjs'
import { fetchData } from './server/utility/fetchData.mjs'
import { movieSchema } from './db/schema.mjs'
import Routes from './server/routes/index.mjs'
import { igdbAuth, spotifyAuth } from './server/utility/apiAuth.mjs'

connectToMongo()

const PORT = 8000
const app = express()
app.use(cors())

// Authenticate IGDB
app.use('/games/:name', igdbAuth)

// Spotify authentication
app.use('/music/:name', spotifyAuth)

// Routes middleware
app.use('/', Routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
