import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import errorLogger from '@middy/error-logger'
import jsonBodyParser from '@middy/http-json-body-parser'
import { groupBy } from 'lodash'

import OrderService from 'services/OrderService'
import CartService from 'services/cart.service'

const cartService = new CartService()
const orderService = new OrderService()

export async function handleCheckout(event) {
  const userId = event.requestContext.authorizer.claims.sub

  try {
    const { Items: userCart } = await cartService.getCart(userId)
    if (!userCart.length) {
      throw new Error('Cart is empty')
    }
    console.log({ cart: userCart })
    const groupedByVendor = groupBy(userCart, 'vendorId');
    
    let orderslist = [];
    const ordersUser = Object.keys(groupedByVendor).map(async vendor => {
      const products = groupedByVendor[vendor];
      const groupedByStockStatus = groupBy(
        products.filter(product => product.product && product.product.stock_status !== undefined),
        product => product.product.stock_status
      );
      
      // Seperate status after by vendor
      const ordersStatus = Object.keys(groupedByStockStatus).map(async (status) => {
        try {
          const Order = await orderService.placeOrder({
            userId,
            products: groupedByStockStatus[status] || [],
            ...event.body,
          });
          console.log({ order: Order });
          orderslist.push(Order);
        } catch (error) {
          console.error('Error placing order:', error);
        }
      });
      await Promise.all(ordersStatus)
      //
    })
    await Promise.all(ordersUser);
    await cartService.onPaymentEvent({ orderId: orderslist });
    await cartService.clearCart(userId, userCart).catch(console.error);
    return {
      statusCode: 200,
      body: JSON.stringify({ order: orderslist }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }

  // return cartService
  //   .getCart(userId)
  //   .then(cart => {
  //     userCart = cart.Items
  //     if (!userCart.length) {
  //       throw new Error('Cart is empty')
  //     }
  //     console.log({ cart: userCart })
  //     return orderService.placeOrder(userId, userCart)
  //   })
  //   .then(order => {
  //     userOrder = order
  //     console.log({ order })
  //     return cartService.clearCart(userId, userCart)
  //   })
  //   .then(() => ({
  //     statusCode: 200,
  //     body: JSON.stringify({ order: userOrder }),
  //   }))
  //   .catch(error => ({
  //     statusCode: 500,
  //     body: JSON.stringify({ message: error.message }),
  //   }))

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({ userId, userOrder }),
  //   }
}

export const checkout = middy(handleCheckout)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(errorLogger())
  .use(cors())
//   .use(jsonBodyParser())
