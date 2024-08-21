import mongoose from 'mongoose'
import { movieSchema } from '../schema.mjs'

export const Movie = mongoose.model('Movie', movieSchema)

export async function createMovie(movieObj) {
  let mov = new Movie(movieObj)
  mov._id = movieObj.id
  await mov.save()
  confirm.log('Movie created')
}

// get all movies
// async function getMovies() {}
// getMovies()
// createMovie()
