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

userRouter.post('/logout', (req, res) => {
  req.session.destroy()
  res.status(200).send('Logout successful')
})

export default userRouter
