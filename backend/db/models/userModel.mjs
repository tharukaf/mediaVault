import mongoose from 'mongoose'
import { userSchema } from '../schema.mjs'
import { retrieveItemsFromDB, saveToDatabaseByID } from '../dbActions.mjs'
import { sha256 } from 'js-sha256'
import { TvShow } from './tvModel.mjs'

export const User = mongoose.model('User', userSchema)

export async function createUser(userData, res) {
  try {
    let user = new User(userData)
    await user.save()
    res.status(200).send('User created')
  } catch (error) {
    error.value = 'User already exists'
    res.status(400).send('User already exists')
  }
}

export async function getUserByEmail(email) {
  let user = await User.findById(sha256(email))
  return user
}

function getCollectionByModelName(user, optStr) {
  switch (optStr) {
    case 'movie':
      return user.movies
    case 'tv':
      return user.tv
    case 'game':
      return user.games
    case 'music':
      return user.music
    case 'book':
      return user.books
    default:
      return ''
  }
}

export async function addMediaItemToUser(model, email, itemId, res) {
  const req = { params: { id: itemId } }
  const optStr = model === TvShow ? 'tv' : model.modelName.toLowerCase()
  const mediaItem = await saveToDatabaseByID(req, res, model, optStr)

  const user = await getUserByEmail(email)
  const collection = getCollectionByModelName(user, optStr)

  const isInArray = collection.some(item => item === itemId.toString())
  if (!isInArray) {
    collection.push(mediaItem._id)
    await user.save()
  }
  res.sendStatus(200)
}

export async function getSameMediaTypeItemsFromUser(model, email, res) {
  const user = await getUserByEmail(email)
  const optStr = model === TvShow ? 'tv' : model.modelName.toLowerCase()

  const collection = getCollectionByModelName(user, optStr)
  retrieveItemsFromDB(model, collection, res)
}
