import { BookAdapter } from 'adapters/book.adapter'

export default class BookService {
  constructor(adapter) {
    this.adapter = adapter || new BookAdapter()
  }

  async getById(bookId) {
    return this.adapter.get(bookId)
  }
}