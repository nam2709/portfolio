import createHttpError from 'http-errors'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import { handleListProductsByCategory } from '../categories/listProductsByCategory'

// Import or define your listProductsByCategory function somewhere above or in another file
// async function listProductsByCategory(categoryId) { ... }

export async function listCollectionsByCategories(event) {
    const categoriesQuery = event.queryStringParameters?.categories;

    const categoryIds = categoriesQuery ? categoriesQuery.split(',') : [];

    if (categoryIds.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No categories provided' })
        };
    }

    // Create an array of promises
    const promises = categoryIds.map(categoryId => 
        handleListProductsByCategory({ pathParameters: { categoryId } })
    );

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    const seenProductIds = new Set();
    const formattedResults = [];

    results.forEach((products, index) => {
        const parsedProducts = JSON.parse(products.body);
        const uniqueProducts = parsedProducts.filter(product => {
            if (seenProductIds.has(product.productId)) {
                return false;
            } else {
                seenProductIds.add(product.productId);
                return true;
            }
        });

        formattedResults.push({
            categoryId: categoryIds[index],
            products: uniqueProducts
        });
    });

    return {
        statusCode: 200,
        body: JSON.stringify(formattedResults)
    };
}



export const listCategoriesByProduct = middy(listCollectionsByCategories)
    .use(httpErrorHandler())
    .use(cors())
