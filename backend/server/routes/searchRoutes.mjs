import express from 'express'
import { fetchArgs } from '../utility/apiAuth.mjs'
import { fetchDataToClient } from '../utility/fetchData.mjs'
import OptObj from '../utility/fetchOptionObj.mjs'
import { Movie, TvShow, Game, Music, Book } from '../../db/models/dbModels.mjs'
import {
  saveToDatabaseByID,
  retrieveItemByIdFromDB,
  retrieveItemsFromDB,
} from '../../db/dbActions.mjs'
import { getModelByMediaType } from '../utility/mediaTypes.mjs'
import { model } from 'mongoose'
import {
  addMediaItemToUser,
  getSameMediaTypeItemsFromUser,
} from '../../db/models/userModel.mjs'

const router = express.Router()

// Search endpoints
router.route('/movies/search/:query').get((req, res) => {
  const { url, options } = OptObj.movie(req.params.query, ...fetchArgs.movie)
  fetchDataToClient(url, options, res)
})

router.get('/tv/search/:query', (req, res) => {
  const { url, options } = OptObj.tv(req.params.query, ...fetchArgs.tv)
  fetchDataToClient(url, options, res)
})

router.get('/games/search/:query', (req, res) => {
  const { url, options } = OptObj.game(req.params.query, ...fetchArgs.game)
  fetchDataToClient(url, options, res)
})

router.get('/books/search/:query', (req, res) => {
  const { url, options } = OptObj.book(req.params.query, ...fetchArgs.book)
  fetchDataToClient(url, options, res)
})

router.get('/music/search/:query', (req, res) => {
  const { url, options } = OptObj.music(req.params.query, ...fetchArgs.music)
  fetchDataToClient(url, options, res)
})

// Media item endpoints
router
  .route('/:mediaType/:id')
  .get(async (req, res) => {
    const [model] = getModelByMediaType(req.params.mediaType)
    const data = await retrieveItemByIdFromDB(model, req.params.id)
    res.json(data)
  })
  // Add a movie by an id to the database
  .post(async (req, res) => {
    const [model, modelName] = getModelByMediaType(req.params.mediaType)
    saveToDatabaseByID(req, res, model, modelName)
    res.sendStatus(200)
  })

router.post('/users/:mediaType/:id', async (req, res) => {
  const { mediaType, id } = req.params
  const email = req.body.email
  const model = getModelByMediaType(mediaType)
  addMediaItemToUser(model, email, id, res)
})

router.get('/users/:email/:mediaType', async (req, res) => {
  const { mediaType, email } = req.params
  // const { email } = req.body
  const model = getModelByMediaType(mediaType)
  getSameMediaTypeItemsFromUser(model, email, res)
})

export default router
