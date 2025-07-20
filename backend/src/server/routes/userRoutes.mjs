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
  createUser(userData, res)
})

// login route
userRouter.post('/login', async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body
  const user = await getUserByEmail(email)
  if (user === null) {
    res.status(404).send('User not found')
  }
  if (user.password === sha256(password)) {
    res.sendStatus(200)
  } else {
    res.sendStatus(401)
  }
})

userRouter.get('/cookie/refresh/:email', async (req, res) => {
  const { email } = req.params
  const user = await getUserByEmail(email)

  req.session.email = user.email
  req.session.name = user.name
  res.cookie('email', `${user.email}`)
  res.cookie('name', `${user.name}`)
  res.json({
    name: req.session.name,
    email: req.session.email,
    token: user._id,
  })
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
