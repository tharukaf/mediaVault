import express from 'express'
import { fetchArgs } from '../utility/apiAuth.mjs'
import { fetchDataToClient } from '../utility/fetchData.mjs'
import OptObj from '../utility/fetchOptionObj.mjs'
import {
  saveToDatabaseByID,
  retrieveItemByIdFromDB,
} from '../../db/dbActions.mjs'
import { getModelByMediaType } from '../utility/mediaTypes.mjs'
import {
  addMediaItemToUser,
  getSameMediaTypeItemsFromUser,
  updateMediaItemStatus,
} from '../../db/models/userModel.mjs'
import { Game } from '../../db/models/gameModel.mjs'
import { Movie } from '../../db/models/moviemodel.mjs'
import { TvShow } from '../../db/models/tvModel.mjs'
import { Music } from '../../db/models/musicModel.mjs'

const router = express.Router()

router.use(express.json())

// Search endpoint
router.route('/search/:mediaType/:query').get((req, res) => {
  const [model, modelName] = getModelByMediaType(req.params.mediaType)
  const { url, options } = OptObj[modelName](
    req.params.query,
    ...fetchArgs[modelName]
  )
  fetchDataToClient(url.search, options.search, res)
})

// Curator endpoint
router.get('/curator', async (req, res) => {
  const data = {
    movies: [],
    tv: [],
    music: [],
    games: [],
  }
  for (const mediaType in data) {
    const [model, modelName] = getModelByMediaType(mediaType)
    const { url, options } = OptObj[modelName](
      req.params.query,
      ...fetchArgs[modelName]
    )
    const res = await fetch(
      url.curator,
      model === Game ? options.curator : options.search
    )
    const items = await res.json()
    data[mediaType] =
      model === Movie || model === TvShow
        ? items.results
        : model === Music
        ? items.albums.items
        : items
    // console.log(data[mediaType])
  }
  res.json(data)
})

// Media item endpoints
router
  // Retrieves a media item by id
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

// User endpoints
// Adds an item of a certain media type to a user's list
router.post('/users/media/:mediaType', async (req, res) => {
  if (req.session) {
    const { mediaType } = req.params
    const { id, email } = req.body
    const [model] = getModelByMediaType(mediaType)
    addMediaItemToUser(model, email, id, res)
  } else {
    res.redirect('/login')
  }
})

// Retrieves all the items of a particular type of media
router.get('/users/:email/:mediaType', async (req, res) => {
  if (req.session) {
    const { mediaType, email } = req.params
    const [model] = getModelByMediaType(mediaType)
    getSameMediaTypeItemsFromUser(model, email, res)
  } else {
    res.sendStatus(401)
  }
})

router.post('/guest/:media/list', async (req, res) => {
  const [model] = getModelByMediaType(req.params.media)
  const { keys } = req.body
  const data = await model.find({ _id: { $in: keys } })
  res.json(data)
})

// Updates the status of a media item
router.put('/users/:email/:mediaType/:id', async (req, res) => {
  if (req.session) {
    const { mediaType, id, email } = req.params
    const { status } = req.body
    const [model] = getModelByMediaType(mediaType)
    updateMediaItemStatus(model, email, id, status)
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

export default router
