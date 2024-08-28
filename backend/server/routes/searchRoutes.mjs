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
} from '../../db/models/userModel.mjs'

const router = express.Router()

// Search endpoint
router.route('/search/:mediaType/:query').get((req, res) => {
  const [model, modelName] = getModelByMediaType(req.params.mediaType)
  const { url, options } = OptObj[modelName](
    req.params.query,
    ...fetchArgs[modelName]
  )
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
