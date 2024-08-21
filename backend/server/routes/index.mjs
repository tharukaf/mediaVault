import express from 'express'
import { fetchArgs } from '../utility/apiAuth.mjs'
import { fetchDataToClient } from '../utility/fetchData.mjs'
import OptObj from '../utility/fetchOptionObj.mjs'

const router = express.Router()

// router.get('/movie/:name', (req, res) => {
//   const { url, options } = OptObj.movie(req.params.name, ...fetchArgs.movie)
//   fetchData(url, options, res)
// })

router.route('/movies/search/:query').get((req, res) => {
  const { url, options } = OptObj.movie(req.params.query, ...fetchArgs.movie)
  fetchDataToClient(url, options, res)
})

router.get('/tv/search/:query', (req, res) => {
  const { url, options } = OptObj.movie(req.params.query, ...fetchArgs.tv)
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

export default router
