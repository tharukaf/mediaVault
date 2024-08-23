import mongoose from 'mongoose'
import { userSchema } from '../schema.mjs'

export const User = mongoose.model('User', userSchema)

export async function createUser(userData) {
  try {
    let user = new User(userData)
    user._id = userData.id
    await user.save()
    console.log('User created')
  } catch (error) {
    console.log(error)
  }
}

export async function getUser(email) {
  let user = await User.findById({ _id: email })
  return user
}

export async function addItemToUser(email, model, itemId) {
  const mediaItem = await new model({ _id: itemId })
  await mediaItem.save()

  const user = await User.findById({ _id: email })
  user[mediaItem.constructor.modelName].push(mediaItem)
  await user.save()
}
