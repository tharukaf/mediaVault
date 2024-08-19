import express from 'express'
import { fetchArgs } from '../../index.mjs'
import { fetchData } from '../utility/fetchData.mjs'
import OptObj from '../utility/fetchOptionObj.mjs'

const router = express.Router()

// router.get('/movie/:name', (req, res) => {
//   const { url, options } = OptObj.movie(req.params.name, ...fetchArgs.movie)
//   fetchData(url, options, res)
// })

router.route('/movies/:search').get((req, res) => {
  const { url, options } = OptObj.movie(req.params.search, ...fetchArgs.movie)
  fetchData(url, options, res)
})

router.get('/tv/:search', (req, res) => {
  const { url, options } = OptObj.movie(req.params.search, ...fetchArgs.tv)
  fetchData(url, options, res)
})

router.get('/games/:search', async (req, res) => {
  const { url, options } = OptObj.game(req.params.search, ...fetchArgs.game)
  fetchData(url, options, res)
})

router.get('/books/:search', (req, res) => {
  const { url, options } = OptObj.book(req.params.search, ...fetchArgs.book)
  fetchData(url, options, res)
})

router.get('/music/:search', (req, res) => {
  const { url, options } = OptObj.music(req.params.search, ...fetchArgs.music)
  fetchData(url, options, res)
})

export default router
