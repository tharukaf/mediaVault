import mongoose from 'mongoose'
import { bookSchema } from '../schema.mjs'
import dotenv from 'dotenv'

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY

export const Book = mongoose.model('Book', bookSchema)
Book.createItem = createBook
Book.url = id =>
  `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`

export async function createBook(res) {
  let book = new Book(res.volumeInfo)
  book._id = res.id
  await book.save()
  return book
}
