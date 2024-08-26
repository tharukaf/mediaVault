import mongoose from 'mongoose'
import { tvSchema } from '../schema.mjs'

export const TvShow = mongoose.model('TvShow', tvSchema)

TvShow.createItem = createTV
TvShow.url = id => `https://api.themoviedb.org/3/tv/${id}?language=en-US`

export async function createTV(res) {
  let tv = new TvShow(res)
  tv._id = res.id
  await tv.save()
  return tv
}
