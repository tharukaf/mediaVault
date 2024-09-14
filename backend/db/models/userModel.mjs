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

function getCollectionByModelName(user, mediaTypeString) {
  switch (mediaTypeString) {
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
  const mediaTypeString =
    model === TvShow ? 'tv' : model.modelName.toLowerCase()
  const mediaItem = await saveToDatabaseByID(req, res, model, mediaTypeString)

  const user = await getUserByEmail(email)
  const collection = getCollectionByModelName(user, mediaTypeString)

  const isInArray = collection.some(item => item.id === itemId.toString())
  if (!isInArray) {
    collection.push({ _id: mediaItem._id, mediaItemStatus: 'unwatched' })
    await user.save()
  }
  res.sendStatus(200)
}

export async function getSameMediaTypeItemsFromUser(model, email, res) {
  const user = await getUserByEmail(email)
  const mediaTypeString =
    model === TvShow ? 'tv' : model.modelName.toLowerCase()

  const collection = getCollectionByModelName(user, mediaTypeString)
  retrieveItemsFromDB(model, collection, res)
}

export async function updateMediaItemStatus(model, email, itemId, status) {
  const user = await getUserByEmail(email)
  const mediaTypeString =
    model === TvShow ? 'tv' : model.modelName.toLowerCase()

  const collection = getCollectionByModelName(user, mediaTypeString)
  const item = collection.find(item => item._id === itemId)
  item.mediaItemStatus = status
  await user.save()
  return item
}
