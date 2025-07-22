import mongoose from 'mongoose'
import { userSchema } from '../schema.mjs'
import { retrieveItemsFromDB, saveToDatabaseByID } from '../dbActions.mjs'
import { TvShow } from './tvModel.mjs'
import crypto from 'crypto'

export const User = mongoose.model('User', userSchema)

export async function createUser(userData) {
  try {
    // Generate unique ID using email
    const id = crypto.createHash('sha256').update(userData.email).digest('hex')

    const user = new User({
      _id: id,
      email: userData.email,
      name: userData.name,
      password: userData.password,
      movies: [],
      tv: [],
      games: [],
      music: [],
      books: []
    })

    await user.save()
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}

export async function getUserByEmail(email) {
  try {
    const id = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex')
    const user = await User.findById(id)
    return user
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

function getCollectionByModelName(user, mediaTypeString) {
  // Handle both singular and plural forms
  const normalizedType = mediaTypeString.replace(/s$/, '') // Remove trailing 's' if present

  switch (normalizedType) {
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
  try {
    const req = { params: { id: itemId } }
    const mediaTypeString = model === TvShow ? 'tv' : model.modelName.toLowerCase()
    const mediaItem = await saveToDatabaseByID(req, res, model, mediaTypeString)

    const user = await getUserByEmail(email)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const collection = getCollectionByModelName(user, mediaTypeString)
    const isInArray = collection.some(item => item._id.toString() === itemId.toString())

    if (!isInArray) {
      collection.push({ _id: mediaItem._id, mediaItemStatus: 'unwatched' })
      await user.save()
      res.status(200).json({ message: 'Media item added to collection', item: mediaItem })
    } else {
      res.status(200).json({ message: 'Media item already in collection', item: mediaItem })
    }
  } catch (error) {
    console.error('Error adding media item to user:', error)
    res.status(500).json({ error: 'Failed to add media item to collection' })
  }
}

export async function getSameMediaTypeItemsFromUser(model, email, res) {
  try {
    const user = await getUserByEmail(email)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const mediaTypeString = model === TvShow ? 'tv' : model.modelName.toLowerCase()
    const collection = getCollectionByModelName(user, mediaTypeString)

    retrieveItemsFromDB(model, collection, res)
  } catch (error) {
    console.error('Error getting media items from user:', error)
    res.status(500).json({ error: 'Failed to retrieve media collection' })
  }
}

export async function updateMediaItemStatus(model, email, itemId, status) {
  try {
    const user = await getUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const mediaTypeString = model === TvShow ? 'tv' : model.modelName.toLowerCase()
    const collection = getCollectionByModelName(user, mediaTypeString)
    const item = collection.find(item => item._id.toString() === itemId.toString())

    if (!item) {
      throw new Error('Media item not found in user collection')
    }

    item.mediaItemStatus = status
    await user.save()
    return item
  } catch (error) {
    console.error('Error updating media item status:', error)
    throw error
  }
}

export async function deleteMediaItemFromUser(email, mediaType, itemId) {
  try {
    const user = await getUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }
    console.log(`Deleting media item: ${mediaType}/${itemId} for user: ${email}`)
    // Handle both singular and plural forms, and map to correct property names
    let collectionName
    switch (mediaType) {
      case 'movies':
      case 'movie':
        collectionName = 'movies'
        break
      case 'tv':
        collectionName = 'tv'
        break
      case 'games':
      case 'game':
        collectionName = 'games'
        break
      case 'music':
        collectionName = 'music'
        break
      case 'books':
      case 'book':
        collectionName = 'books'
        break
      default:
        throw new Error('Invalid media type')
    }

    const collection = user[collectionName]
    if (!Array.isArray(collection)) {
      throw new Error('Invalid media type')
    }

    const initialLength = collection.length
    const updatedCollection = collection.filter(item => item._id.toString() !== itemId.toString())

    if (updatedCollection.length === initialLength) {
      throw new Error('Media item not found in collection')
    }

    user[collectionName] = updatedCollection
    await user.save()
    return { message: 'Media item removed successfully' }
  } catch (error) {
    console.error('Error deleting media item from user:', error)
    throw error
  }
}
