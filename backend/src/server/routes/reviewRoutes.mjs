import express from 'express'
import { Review } from '../../db/models/reviewModel.mjs'

const router = express.Router()

// Get all reviews for a media item
router.get('/:mediaType/:mediaId', async (req, res) => {
    const { mediaType, mediaId } = req.params
    try {
        const reviews = await Review.find({ mediaId, mediaType })
        res.json(reviews)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Create a new review
router.post('/', async (req, res) => {
    try {
        const review = new Review(req.body)
        await review.save()
        res.status(201).json(review)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Update a review by id
router.put('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(review)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Delete a review by id
router.delete('/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id)
        res.json({ message: 'Review deleted' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

export default router
