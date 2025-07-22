import express from 'express'
import { optionalAuth } from '../middleware/auth.mjs'

const mediaRouter = express.Router()

mediaRouter.use(express.json())

// Add any media-related routes here that don't require auth
// For now, just a placeholder endpoint

mediaRouter.get('/health', (req, res) => {
    res.json({ status: 'Media routes are working' })
})

export default mediaRouter
