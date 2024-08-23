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

// Item endpoints
router
  .route('/movies/:id')
  .get(async (req, res) => {
    const data = await retrieveItemByIdFromDB(Movie, req.params.id)
    res.json(data)
  })
  // Add a movie by an id to the database
  .post(async (req, res) => {
    saveToDatabaseByID(req, res, Movie, 'movie')
  })

router
  // Get a tv show by id
  .route('/tv/:id')
  .get(async (req, res) => {
    const data = await retrieveItemByIdFromDB(TvShow, req.params.id)
    res.json(data)
  })
  // Add a tv show by an id to the database
  .post(async (req, res) => {
    saveToDatabaseByID(req, res, TvShow, 'tv')
  })

router
  // Get a game by id
  .route('/games/:id')
  .get(async (req, res) => {
    const data = await retrieveItemByIdFromDB(Game, req.params.id)
    res.json(data)
  })
  // Add a game by an id to the database
  .post(async (req, res) => {
    saveToDatabaseByID(req, res, Game, 'game')
  })

router
  .route('/music/:id')
  // Get music by id
  .get(async (req, res) => {
    const data = await retrieveItemByIdFromDB(Music, req.params.id)
    res.json(data)
  })
  // Add music by an id to the database
  .post(async (req, res) => {
    saveToDatabaseByID(req, res, Music, 'music')
  })

router
  .route('/books/:id')
  .get(async (req, res) => {
    const data = await retrieveItemByIdFromDB(Book, Number(req.params.id))
    res.json(data)
  })
  .post(async (req, res) => {
    saveToDatabaseByID(req, res, Book, 'book')
  })

export default router
