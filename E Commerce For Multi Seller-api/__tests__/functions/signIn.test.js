import { jwtDecode } from 'jwt-decode'
import { handleSignIn } from 'functions/auth/signIn'

it('should allow user to sign in', async () => {
  // GIVEN
  // const event = { body: JSON.stringify(body) }
  const event = {
    body: {
      Email: 'khanhtt101@gmail.com',
      Password: 'abc123',
    },
  }
  process.env.AWS_REGION = 'ap-southeast-2' // OHIO
  process.env.USER_POOL_ID = 'ap-southeast-2_Do03mPscE'
  process.env.USER_POOL_CLIENT_ID = '4llqdi7h5k6h4cu32id15e3q5k'
  // console.log({ ENV: process.env })

  // WHEN
  const response = await handleSignIn(event)
  console.log(response)

  // THEN
  expect(response.statusCode).toBe(200)
  const body = JSON.parse(response.body)
  console.log(body)
  const { message, idToken, accessToken } = body
  // const { AuthenticationResult } = response
  // expect(AuthenticationResult).toBeDefined()
  // const { AccessToken, RefreshToken, IdToken } = AuthenticationResult
  console.dir(jwtDecode(accessToken))
  console.dir(jwtDecode(idToken))
  // console.dir(jwtDecode(RefreshToken))
})

// it('should allow user to get user attributes', async () => {})
