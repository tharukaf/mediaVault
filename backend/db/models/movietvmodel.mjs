import mongoose from 'mongoose'
import { movieSchema } from '../schema.mjs'

export const Movie = mongoose.model('Movie', movieSchema)

export async function createMovie(movieObj) {
  console.log(movieObj)
  let mov = new Movie(movieObj)
  mov._id = movieObj.id
  console.log(mov)
  await mov.save()
}

// get all movies
// async function getMovies() {}
// getMovies()
// createMovie()
