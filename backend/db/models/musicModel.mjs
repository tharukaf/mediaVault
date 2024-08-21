import mongoose from 'mongoose'
import { musicSchema } from '../schema.mjs'

export const Music = mongoose.model('Music', musicSchema)

export async function createMusic(res) {
  let music = new Music(res)
  console.log(res)
  music._id = res.id
  await music.save()
  console.log('Music created')
}
