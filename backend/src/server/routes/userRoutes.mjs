import express from 'express'
import sha256 from 'js-sha256'
import { createUser, getUserByEmail } from '../../db/models/userModel.mjs'

const userRouter = express.Router()

userRouter.use(express.json())

// create user route
userRouter.post('/users', async (req, res) => {
  const userData = req.body
  userData._id = sha256(userData.email)
  userData.password = sha256(userData.password)
  try {
    const existing = await getUserByEmail(userData.email)
    if (existing) {
      return res.status(409).json({ error: 'User already exists' })
    }
    createUser(userData, res)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// login route
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await getUserByEmail(email)
    if (!user) {
      return res.status(404).send('User not found')
    }
    if (user.password === sha256(password)) {
      return res.sendStatus(200)
    } else {
      return res.sendStatus(401)
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

userRouter.get('/cookie/refresh/:email', async (req, res) => {
  const { email } = req.params
  try {
    const user = await getUserByEmail(email)
    if (!user) return res.status(404).json({ error: 'User not found' })
    req.session.email = user.email
    req.session.name = user.name
    res.cookie('email', `${user.email}`)
    res.cookie('name', `${user.name}`)
    res.json({
      name: req.session.name,
      email: req.session.email,
      token: user._id,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// Delete a media item from user's profile
userRouter.delete('/users/media/:mediaType/:itemId', async (req, res) => {
  const { mediaType, itemId } = req.params
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })
  try {
    const user = await getUserByEmail(email)
    if (!user) return res.status(404).json({ error: 'User not found' })
    const collection = user[mediaType]
    if (!Array.isArray(collection)) return res.status(400).json({ error: 'Invalid media type' })
    const idx = collection.findIndex(item => item._id.toString() === itemId.toString())
    if (idx === -1) return res.status(404).json({ error: 'Media item not found' })
    collection.splice(idx, 1)
    await user.save()
    res.json({ message: 'Media item deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default userRouter
