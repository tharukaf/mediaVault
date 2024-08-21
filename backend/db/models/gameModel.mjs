import mongoose from 'mongoose'
import { gameSchema } from '../schema.mjs'

export const Game = mongoose.model('Game', gameSchema)

export async function createGame(res) {
  let game = new Game(res[0])
  game._id = res[0].id
  await game.save()
  console.log('Game created')
}
