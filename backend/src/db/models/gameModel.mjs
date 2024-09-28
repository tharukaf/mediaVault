import mongoose from 'mongoose'
import { gameSchema } from '../schema.mjs'

export const Game = mongoose.model('Game', gameSchema)

Game.url = id => `https://api.igdb.com/v4/games`
Game.createItem = createGame

export async function createGame(res) {
  let game = new Game(res[0])
  game._id = res[0].id
  await game.save()
  return game
}
