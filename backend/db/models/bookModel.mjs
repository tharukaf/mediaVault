import mongoose from 'mongoose'
import { bookSchema } from '../schema.mjs'

export const Book = mongoose.model('Book', bookSchema)

export async function createBook(res) {
  let book = new Book(res.volumeInfo)
  book._id = res.id
  await book.save()
  console.log('Book created')
}
