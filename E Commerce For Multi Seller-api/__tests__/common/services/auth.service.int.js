// import { it, expect } from 'vitest'

import {
  addUserToGroup,
  adminCreateUser,
  adminDeleteUser,
  adminGetUser,
  adminSetUserPassword,
  adminUpdateUserAttributes,
  confirmForgotPassword,
  confirmSignUp,
  forgotPassword,
  getUser,
  listUsersInGroup,
  listUses,
  signIn,
  signUp,
  updateUserAttributes,
} from 'services/auth.service'

import { jwtDecode } from 'jwt-decode'

it.skip('should allow use to register', async () => {
  const email = 'khanhtt101@gmail.com'
  const password = 'abc123'
  const firstName = 'Khanh'
  const lastName = 'Shop'
  process.env.USER_POOL_CLIENT_ID = 'k2cio126vjgqji7r9gnv9ceq8'

  const user = await signUp({ email, password, firstName, lastName })
  console.log(user)
})

it.skip('should allow admin to create user', async () => {
  const email = 'khanhtt@outlook.com'
  const password = 'abc123'
  const firstName = 'Khanh'
  const lastName = 'User'
  process.env.USER_POOL_ID = 'us-east-1_h0gndUK7h'

  const user = await adminCreateUser({ email, password, firstName, lastName })
  console.log(user)
})

it(
  'should allow shop user to sign in',
  async () => {
    const username = 'khanhtt101@gmail.com'
    const password = 'abc123'
    process.env.USER_POOL_CLIENT_ID = 'k2cio126vjgqji7r9gnv9ceq8'
    const user = await signIn({ username, password })
      .then(user => user)
      .catch(error => console.error(error))
    console.dir(user)
    const { AuthenticationResult } = user
    const { AccessToken, RefreshToken, IdToken } = AuthenticationResult

    console.dir(jwtDecode(AccessToken))
    console.dir(jwtDecode(IdToken))
    console.dir(jwtDecode(AccessToken))

    const me = await getUser({ accessToken: AccessToken })
    console.dir(me)
  },
  { timeout: 10000 }
)

it.skip('should allow normal to sign in', async () => {
  const username = 'khanhtt@outlook.com'
  const password = 'abc123'
  process.env.USER_POOL_CLIENT_ID = 'k2cio126vjgqji7r9gnv9ceq8'
  const user = await signIn({ username, password })
    .then(user => user)
    .catch(error => console.log(error))
  console.log(user)
})

it.skip('should allow user to confirm sign up', async () => {
  const username = 'khanhtt101@gmail.com'
  const code = '367257'
  process.env.USER_POOL_CLIENT_ID = 'k2cio126vjgqji7r9gnv9ceq8'

  await confirmSignUp({ username, code })
    .then(data => console.log(data))
    .catch(error => console.error(error))
})

it.skip('should list users in the pool', async () => {
  process.env.USER_POOL_ID = 'us-east-1_h0gndUK7h'
  const users = await listUses()
  const { Users } = users
  expect(Users).toBeInstanceOf(Array)
  expect(Users.length).toBeGreaterThan(0)
  console.table(
    Users.map(user => {
      let it = user
      user.Attributes.map(attr => {
        it[attr.Name] = attr.Value
      })
      delete it.Attributes
      delete it.sub
      return it
    })
  )
})

it.skip('should get user by username', async () => {
  process.env.USER_POOL_ID = 'us-east-1_h0gndUK7h'
  const username = 'khanhtt101@gmail.com'

  const user = await adminGetUser({ username })
  console.dir(user)
})

it.skip('should delete user by username', async () => {
  process.env.USER_POOL_ID = 'us-east-1_h0gndUK7h'
  const username = 'khanhtt11@gmail.com'

  const user = await adminDeleteUser({ username })
  console.dir(user)
})

it.skip('should set user password', async () => {
  process.env.USER_POOL_ID = 'us-east-1_h0gndUK7h'
  const username = 'khanhtt@outlook.com'
  const password = 'abc123'

  const user = await adminSetUserPassword({ username, password })

  console.dir(user)
})

it.skip('should list users in group', async () => {
  process.env.USER_POOL_ID = 'us-east-1_h0gndUK7h'
  const group = 'User'
  const users = await listUsersInGroup({
    userPoolId: process.env.USER_POOL_ID,
    group,
    limit: 10,
    nextToken: null,
  })
  const { Users } = users
  // console.table(Users)
  expect(Users).toBeInstanceOf(Array)
  expect(Users.length).toBeGreaterThan(0)
  console.table(
    Users.map(user => {
      let it = user
      user.Attributes.map(attr => {
        it[attr.Name] = attr.Value
      })
      delete it.Attributes
      delete it.sub
      return it
    })
  )

  const { Users: Shops } = await listUsersInGroup({ group: 'Shop' })
  console.table(
    Shops.map(user => {
      let it = user
      user.Attributes.map(attr => {
        it[attr.Name] = attr.Value
      })
      delete it.Attributes
      delete it.sub
      return it
    })
  )
})

it.skip('should add user to group', async () => {
  process.env.USER_POOL_ID = 'us-east-1_h0gndUK7h'
  const group = 'Shop'
  const username = 'khanhtt101@gmail.com'

  const user = await addUserToGroup({ username, group })
  console.dir(user)
})

it.skip('should allow user to request password reset', async () => {
  const username = 'khanhtt@outlook.com'
  process.env.USER_POOL_CLIENT_ID = 'k2cio126vjgqji7r9gnv9ceq8'

  const response = await forgotPassword({ username })
  console.dir(response)
})

it.skip('should allow user to reset password', async () => {
  const username = 'khanhtt@outlook.com'
  const code = '729837'
  const newPassword = 'abc1234'
  process.env.USER_POOL_CLIENT_ID = 'k2cio126vjgqji7r9gnv9ceq8'

  const response = await confirmForgotPassword({ username, code, newPassword })
  console.dir(response)
  const user = await signIn({ username, password: newPassword })
  console.dir(user)
})

it.skip('should update user attributes', async () => {
  process.env.USER_POOL_CLIENT_ID = 'k2cio126vjgqji7r9gnv9ceq8'
  const username = 'khanhtt@outlook.com'
  const password = 'abc1234'
  const user = await signIn({ username, password })
  // console.dir(user)
  const { AuthenticationResult } = user
  const { AccessToken } = AuthenticationResult
  const attributes = {
    phone_number: '+84917230586',
  }
  console.table(
    Object.keys(attributes).map(key => ({
      Name: key,
      Value: attributes[key],
    }))
  )

  const response = await updateUserAttributes({
    accessToken: AccessToken,
    attributes,
  })

  const me = await getUser({ accessToken: AccessToken })
  console.dir(me)
})

it.skip('should allow admin to update user attributes', async () => {
  process.env.USER_POOL_ID = 'us-east-1_h0gndUK7h'
  const username = 'khanhtt@outlook.com'
  const attributes = {
    phone_number_verified: 'true',
  }
  const response = await adminUpdateUserAttributes({ username, attributes })
  console.dir(response)
  const user = await adminGetUser({ username })
  console.dir(user)
})
