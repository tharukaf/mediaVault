import mongoose from 'mongoose'
import { tvSchema } from '../schema.mjs'

export const TvShow = mongoose.model('TvShow', tvSchema)

export async function createTV(res) {
  let tv = new TvShow(res)
  tv._id = res.id
  await tv.save()
  console.log('TV created')
}
