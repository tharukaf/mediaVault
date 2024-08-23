import mongoose from 'mongoose'
import { movieSchema } from '../schema.mjs'

export const Movie = mongoose.model('Movie', movieSchema)

Movie.createItem = createMovie
Movie.url = id => `https://api.themoviedb.org/3/movie/${id}?language=en-US`

export async function createMovie(movieObj) {
  let mov = new Movie(movieObj)
  mov._id = movieObj.id
  await mov.save()
  console.log('Movie created')
}
