import mongoose from 'mongoose'
import { musicSchema } from '../schema.mjs'

export const Music = mongoose.model('Music', musicSchema)

Music.createItem = createMusic
Music.url = id => `https://api.spotify.com/v1/tracks/${id}`

export async function createMusic(res) {
  let music = new Music(res)
  // console.log(res.id)
  music._id = res.id
  await music.save()
  return music
}
