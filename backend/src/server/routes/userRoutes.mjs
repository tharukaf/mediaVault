import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import {
  createUser,
  getUserByEmail,
  addMediaItemToUser,
  getSameMediaTypeItemsFromUser,
  updateMediaItemStatus,
  deleteMediaItemFromUser
} from '../../db/models/userModel.mjs'
import { authenticateToken } from '../middleware/auth.mjs'
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors
} from '../middleware/validation.mjs'

const userRouter = express.Router()

userRouter.use(express.json())

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

// User registration
userRouter.post('/register',
  authLimiter,
  validateRegistration,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, name, password } = req.body

      // Check if user already exists
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' })
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const userData = {
        email: email.toLowerCase(),
        name: name.trim(),
        password: hashedPassword
      }

      await createUser(userData)

      // Generate JWT token
      const token = jwt.sign(
        { email: userData.email, name: userData.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.status(201).json({
        message: 'User created successfully',
        user: {
          email: userData.email,
          name: userData.name
        },
        token
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({ error: 'Internal server error during registration' })
    }
  }
)

// User login
userRouter.post('/login',
  authLimiter,
  validateLogin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body

      // Find user
      const user = await getUserByEmail(email.toLowerCase())
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        message: 'Login successful',
        user: {
          email: user.email,
          name: user.name
        },
        token
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Internal server error during login' })
    }
  }
)

// Get current user profile
userRouter.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await getUserByEmail(req.user.email)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      email: user.email,
      name: user.name,
      mediaCollections: {
        movies: user.movies.length,
        tv: user.tv.length,
        games: user.games.length,
        music: user.music.length,
        books: user.books.length
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Logout (client-side token invalidation)
userRouter.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

// Add media item to user's collection
userRouter.post('/media/:mediaType/:itemId', authenticateToken, async (req, res) => {
  try {
    const { mediaType, itemId } = req.params
    const { status = 'unwatched' } = req.body

    // Import the appropriate model based on mediaType
    let model
    switch (mediaType) {
      case 'movie':
        const { Movie } = await import('../../db/models/movieModel.mjs')
        model = Movie
        break
      case 'tv':
        const { TvShow } = await import('../../db/models/tvModel.mjs')
        model = TvShow
        break
      case 'game':
        const { Game } = await import('../../db/models/gameModel.mjs')
        model = Game
        break
      case 'music':
        const { Music } = await import('../../db/models/musicModel.mjs')
        model = Music
        break
      case 'book':
        const { Book } = await import('../../db/models/bookModel.mjs')
        model = Book
        break
      default:
        return res.status(400).json({ error: 'Invalid media type' })
    }

    await addMediaItemToUser(model, req.user.email, itemId, res)
  } catch (error) {
    console.error('Add media error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user's media collection by type
userRouter.get('/media/:mediaType', authenticateToken, async (req, res) => {
  try {
    const { mediaType } = req.params

    // Import the appropriate model based on mediaType
    let model
    switch (mediaType) {
      case 'movie':
        const { Movie } = await import('../../db/models/movieModel.mjs')
        model = Movie
        break
      case 'tv':
        const { TvShow } = await import('../../db/models/tvModel.mjs')
        model = TvShow
        break
      case 'game':
        const { Game } = await import('../../db/models/gameModel.mjs')
        model = Game
        break
      case 'music':
        const { Music } = await import('../../db/models/musicModel.mjs')
        model = Music
        break
      case 'book':
        const { Book } = await import('../../db/models/bookModel.mjs')
        model = Book
        break
      default:
        return res.status(400).json({ error: 'Invalid media type' })
    }

    await getSameMediaTypeItemsFromUser(model, req.user.email, res)
  } catch (error) {
    console.error('Get media collection error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update media item status
userRouter.patch('/media/:mediaType/:itemId/status', authenticateToken, async (req, res) => {
  try {
    const { mediaType, itemId } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    // Import the appropriate model based on mediaType
    let model
    switch (mediaType) {
      case 'movie':
        const { Movie } = await import('../../db/models/movieModel.mjs')
        model = Movie
        break
      case 'tv':
        const { TvShow } = await import('../../db/models/tvModel.mjs')
        model = TvShow
        break
      case 'game':
        const { Game } = await import('../../db/models/gameModel.mjs')
        model = Game
        break
      case 'music':
        const { Music } = await import('../../db/models/musicModel.mjs')
        model = Music
        break
      case 'book':
        const { Book } = await import('../../db/models/bookModel.mjs')
        model = Book
        break
      default:
        return res.status(400).json({ error: 'Invalid media type' })
    }

    const updatedItem = await updateMediaItemStatus(model, req.user.email, itemId, status)
    res.json({ message: 'Status updated successfully', item: updatedItem })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete a media item from user's collection
userRouter.delete('/media/:mediaType/:itemId', authenticateToken, async (req, res) => {
  try {
    const { mediaType, itemId } = req.params

    const user = await getUserByEmail(req.user.email)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const collection = user[mediaType]
    if (!Array.isArray(collection)) {
      return res.status(400).json({ error: 'Invalid media type' })
    }

    const initialLength = collection.length
    const updatedCollection = collection.filter(item => item._id.toString() !== itemId.toString())

    if (updatedCollection.length === initialLength) {
      return res.status(404).json({ error: 'Media item not found in collection' })
    }

    user[mediaType] = updatedCollection
    await user.save()

    res.json({ message: 'Media item removed from collection successfully' })
  } catch (error) {
    console.error('Delete media error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default userRouter
