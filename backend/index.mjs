import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectToMongo from './db/config.mjs'
import { fetchDataToServer } from './server/utility/fetchData.mjs'
import Routes from './server/routes/index.mjs'
import { igdbAuth, spotifyAuth } from './server/utility/apiAuth.mjs'
import OptObj from './server/utility/fetchOptionObj.mjs'
import { fetchArgs } from './server/utility/apiAuth.mjs'
import {
  createMovie,
  createTV,
  createMusic,
  createGame,
  createBook,
} from './db/models/dbModels.mjs'
import { Movie } from './db/models/moviemodel.mjs'
import { TvShow } from './db/models/tvModel.mjs'
import { Game } from './db/models/gameModel.mjs'
import { Music } from './db/models/musicModel.mjs'
import { Book } from './db/models/bookModel.mjs'
import { createUser, getUser } from './db/models/userModel.mjs'
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

// Get a movie by id
app.get('/movies/:id', async (req, res) => {
  const data = await retrieveItemByIdFromDB(Movie, Number(req.params.id))
  res.json(data)
})
// Add a movie by an id to the database
app.post('/movies/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.id, ...fetchArgs.movie)
  url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
  saveToDatabaseByID(req, res, url, options, createMovie)
})

async function retrieveItemByIdFromDB(model, id) {
  // console.log(Number('dfa%20asdf'))
  let isNum = /^\d+$/.test(id)
  const data = await model.findById(isNum ? Number(id) : 0)
  return data
}

async function retrieveItemsFromDB(model, idList) {
  const data = await model.find({ _id: { $in: idList } })
  return data
}

app.get('/test', async (req, res) => {
  // const data = await retrieveItemsFromDB(TvShow, [60573, 15264])
  // res.json(data)

  const email = 'test@email.com'
  const user = await getUser(email)
  console.log(user)
})

app.get('/tv/:id', async (req, res) => {
  const data = await retrieveItemByIdFromDB(TvShow, req.params.id)
  res.json(data)
})
app.post('/tv/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.id, ...fetchArgs.tv)
  url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`
  saveToDatabaseByID(req, res, url, options, createTV)
})

app.get('/games/:id', async (req, res) => {
  const data = await retrieveItemByIdFromDB(Game, Number(req.params.id))
  res.json(data)
})
app.post('/games/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.game(req.params.id, ...fetchArgs.game)
  options.body = `fields name,summary,cover.url,genres,first_release_date,age_ratings,aggregated_rating,platforms; where id = ${id};`
  console.log(options)
  saveToDatabaseByID(req, res, url, options, createGame)
})

app.get('/music/:id', async (req, res) => {
  const data = await retrieveItemByIdFromDB(Music, Number(req.params.id))
  res.json(data)
})
app.post('/music/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.music(req.params.id, ...fetchArgs.music)
  url = `https://api.spotify.com/v1/tracks/${id}`
  saveToDatabaseByID(req, res, url, options, createMusic)
})

app.get('/books/:id', async (req, res) => {
  const data = await retrieveItemByIdFromDB(Book, Number(req.params.id))
  res.json(data)
})
app.post('/books/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.book(req.params.id, ...fetchArgs.book)
  url = `https://www.googleapis.com/books/v1/volumes/${id}`
  saveToDatabaseByID(req, res, url, options, createBook)
})

async function saveToDatabaseByID(req, res, url, options, createMedia) {
  const data = await fetchDataToServer(url, options)
  createMedia(data)
  res.sendStatus(200)
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
