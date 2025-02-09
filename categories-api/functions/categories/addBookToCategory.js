import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
// import jsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
// import { Logger } from '@aws-lambda-powertools/logger'

import CategoryService from 'services/CategoryService'
import BookService from 'services/BookService'
import errorLogger from '@middy/error-logger'

// const logger = new Logger()
const isEmptyObject = obj => Object.keys(obj).length === 0;
// only vendor can add Book to category
export async function handleAddBookToCategory(event) {
  // const { claims } = event.requestContext.authorizer
  // if (!claims['cognito:groups'].includes('Vendor') && !claims['cognito:groups'].includes('Admin')) {
  //   throw new createHttpError.Forbidden('User is not a vendor or admin');
  // }

  const { categoryId, bookId } = event.pathParameters
  const service = new CategoryService()
  const bookService = new BookService()

  const bookDetail = await bookService.getById(bookId);
  if (!bookDetail || isEmptyObject(bookDetail)) {
    return {
      statusCode: 404, // Change to 404 to indicate "Not Found"
      body: JSON.stringify({ message: 'The book does not exist' }),
    };
  }

  return service
    .addBookToCategory({ categoryId, bookId })
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Book added to category' }),
    }))
    .catch(error => {
      console.error('Error adding book to category:', error);
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          message: error.message || 'Internal Server Error',
        }),
      };
    })
}

export const addBookToCategory = middy(handleAddBookToCategory)
  .use(httpErrorHandler())
  .use(errorLogger())
  // .use(jsonBodyParser())
  .use(cors())
