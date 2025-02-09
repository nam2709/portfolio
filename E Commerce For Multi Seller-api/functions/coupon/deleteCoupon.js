import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import CouponService from 'services/CouponService'

export async function handleDeleteCoupon(event) {
  const userId = event.requestContext.authorizer.claims.sub
  const CouponId = event.pathParameters.id

  const service = new CouponService()

  return service
    .deleteCoupon(CouponId)
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed Coupon ${CouponId}`,
        CouponId,
      }),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}

export const deleteCoupon = middy(handleDeleteCoupon)
  .use(httpErrorHandler())
  .use(cors())
