import mongoose from 'mongoose'

export const movieSchema = new mongoose.Schema({
  name: String,
  year: Number,
  poster: String,
  rating: Number,
})
