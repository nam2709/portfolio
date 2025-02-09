import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import httpPartialResponse from '@middy/http-partial-response'
// import { Logger } from '@aws-lambda-powertools/logger'

import CategoryService from 'services/CategoryService'
import BookService from 'services/BookService'

// const logger = new Logger()

export async function handleListBooksByCategory(event) {
  const { categoryId } = event.pathParameters
  const service = new CategoryService()
  const bookService = new BookService()

  let books
  try {
    const { Items } = await service.listBooksByCategory(categoryId)
    books = await Promise.all(
      Items.map(async book => {
        const { book: bookDetail } = await bookService.getById(
          book.bookId
        )

        if (!bookDetail) {
          return undefined;
        }

        return {
          bookId: book.bookId,
          ...bookDetail,
        }
      })
    )
    // Filter out undefined results
    books = books.filter(Boolean);
  } catch (error) {
    throw new createHttpError.InternalServerError(error.message)
  }
  return {
    statusCode: 200,
    body: JSON.stringify(books),
  }
}

export const listBooksByCategory = middy(handleListBooksByCategory)
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
  .use(httpPartialResponse())
