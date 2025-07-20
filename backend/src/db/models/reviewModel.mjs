import mongoose from 'mongoose'

export const reviewSchema = new mongoose.Schema({
    mediaId: { type: String, required: true }, // id of the media item (movie, tv, book, etc)
    mediaType: { type: String, required: true },
    userName: { type: String, required: true },
    reviewDate: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5, required: true },
    reviewText: { type: String, required: true },
})

export const Review = mongoose.model('Review', reviewSchema)
