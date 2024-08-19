import mongoose from 'mongoose'
import { movieSchema } from '../schema.mjs'

export const Movie = mongoose.model('Movie', movieSchema)

async function createMovie() {
  const mov = new Movie({
    name: 'Silence of the lambs',
    year: 1991,
    poster: 'https://www.imdb.com/title/tt0102926/mediaviewer/rm4263666176/',
    rating: 8.6,
  })
  await mov.save()
}

// get all movies
async function getMovies() {}
getMovies()
createMovie()
