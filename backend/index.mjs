import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectToMongo from './db/config.mjs'
import { fetchDataToServer } from './server/utility/fetchData.mjs'
import Routes from './server/routes/index.mjs'
import { igdbAuth, spotifyAuth } from './server/utility/apiAuth.mjs'
import { Movie } from './db/models/moviemodel.mjs'
import { TvShow } from './db/models/tvModel.mjs'
import { Game } from './db/models/gameModel.mjs'
import { Music } from './db/models/musicModel.mjs'
import { Book } from './db/models/bookModel.mjs'
import { createUser, getUser } from './db/models/userModel.mjs'
// import {
//   retrieveItemByIdFromDB,
//   retrieveItemsFromDB,
//   saveToDatabaseByID,
// } from './db/dbActions.mjs'

import sha256 from 'js-sha256'

connectToMongo()

const PORT = 8000
const app = express()
app.use(cors())

// Authenticate IGDB
app.use(['/games/search/:query', '/games/:id'], igdbAuth)

// Spotify authentication
app.use(['/music/search/:query', '/music/:id'], spotifyAuth)

// Routes middleware
app.use('/', Routes)

app.get('/test', async (req, res) => {
  const email = 'test@email.com'
  const user = await getUser(email)
  console.log(user)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
