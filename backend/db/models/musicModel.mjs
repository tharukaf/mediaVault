import mongoose from 'mongoose'
import { musicSchema } from '../schema.mjs'

export const Music = mongoose.model('Music', musicSchema)

Music.createItem = createMusic
Music.url = id => `https://api.spotify.com/v1/tracks/${id}`

export async function createMusic(res) {
  let music = new Music(res)
  music._id = res.id
  await music.save()
  console.log(music._id)
  return music
}
