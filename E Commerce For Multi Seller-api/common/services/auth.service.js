import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  ListUsersCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AdminAddUserToGroupCommand,
  AuthFlowType,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
  ListUsersInGroupCommand,
  GetUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  ChangePasswordCommand,
  UpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommand,
  ResendConfirmationCodeCommand,
  AdminConfirmSignUpCommand,
  AdminListGroupsForUserCommand,
  GlobalSignOutCommand,
  AdminRemoveUserFromGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'

import { jwtDecode } from 'jwt-decode'
import createHttpError from 'http-errors'

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
})

export async function signUp({
  email,
  password,
  firstName,
  lastName,
  clientId = null,
}) {
  const command = new SignUpCommand({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'given_name', Value: firstName },
      { Name: 'family_name', Value: lastName },
    ],
  })

  return client.send(command)
}

export async function confirmSignUp({ username, code, clientId }) {
  const command = new ConfirmSignUpCommand({
    ClientId: clientId,
    Username: username,
    ConfirmationCode: code,
  })

  return client.send(command)
}

export async function adminAddUserToGroup({ username, group, UserPoolId }) {
  console.log({ username, group, UserPoolId })
  const command = new AdminAddUserToGroupCommand({
    GroupName: group,
    Username: username,
    UserPoolId: UserPoolId || process.env.USER_POOL_ID,
  })

  return client.send(command)
  // AdminAddUserToGroup
}

export async function adminRemoveUserFromGroup({ username, group, UserPoolId }) {
  console.log({ username, group, UserPoolId })
  const command = new AdminRemoveUserFromGroupCommand({
    GroupName: group,
    Username: username,
    UserPoolId: UserPoolId || process.env.USER_POOL_ID,
  })

  return client.send(command)
  // AdminAddUserToGroup
}

export async function listUses() {
  const command = new ListUsersCommand({
    UserPoolId: process.env.USER_POOL_ID,
  })

  return client.send(command)
}

export async function signIn({
  username,
  password,
  refreshToken = null,
  clientId = null,
}) {
  const params = {
    ClientId: clientId || process.env.USER_POOL_CLIENT_ID,
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: username
      ? {
          USERNAME: username,
          PASSWORD: password,
        }
      : { RefreshToken: refreshToken },
  }
  console.log('Auth.SignIn', params)

  return client.send(new InitiateAuthCommand(params))
  // AdminInitiateAuth
  // return token
}

export async function adminCreateUser({
  email,
  password,
  firstName,
  lastName,
}) {
  const command = new AdminCreateUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'given_name', Value: firstName },
      { Name: 'family_name', Value: lastName },
    ],
    TemporaryPassword: password,
  })
  return client.send(command)
}

export async function adminGetUser({ username }) {
  const command = new AdminGetUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  })

  return client.send(command)
}

export async function adminDeleteUser({ username }) {
  const command = new AdminDeleteUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  })

  return client.send(command)
}

export async function adminSetUserPassword({ username, password }) {
  const command = new AdminSetUserPasswordCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
    Password: password,
    Permanent: true,
  })

  return client.send(command)
}

export async function listUsersInGroup({
  userPoolId,
  group,
  limit,
  nextToken,
}) {
  const command = new ListUsersInGroupCommand({
    UserPoolId: userPoolId || process.env.USER_POOL_ID,
    GroupName: group,
    Limit: limit,
    NextToken: nextToken,
  })

  return client.send(command)
}

export async function getUser({ accessToken }) {
  const command = new GetUserCommand({
    AccessToken: accessToken,
  })

  return client.send(command)
}

export async function signOut({ accessToken }) {
  const command = new GlobalSignOutCommand({
    AccessToken: accessToken,
  })

  return client.send(command)
}

export async function adminConfirmSign({ username }) {
  const command = new AdminConfirmSignUpCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  })

  return client.send(command)
}

export async function adminDisableUser({ username }) {
  const command = new AdminDisableUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  })

  return client.send(command)
}

export async function adminEnableUser({ username }) {
  const command = new AdminEnableUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  })

  return client.send(command)
}

export async function adminListGroupsForUser({ username, limit, nextToken }) {
  const command = new AdminListGroupsForUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
    Limit: limit,
    NextToken: nextToken,
  })

  return client.send(command)
}

export async function changePassword({
  accessToken,
  previousPassword,
  proposedPassword,
}) {
  const command = new ChangePasswordCommand({
    PreviousPassword: previousPassword,
    ProposedPassword: proposedPassword,
    AccessToken: accessToken,
  })

  return client.send(command)
}

export async function confirmForgotPassword({ username, code, newPassword }) {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: process.env.USER_POOL_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
  })

  return client.send(command)
}

export async function forgotPassword({ username }) {
  const command = new ForgotPasswordCommand({
    ClientId: process.env.USER_POOL_CLIENT_ID,
    Username: username,
  })

  return client.send(command)
}

export async function updateUserAttributes({ accessToken, attributes }) {
  const command = new UpdateUserAttributesCommand({
    AccessToken: accessToken,
    UserAttributes: Object.keys(attributes).map(key => ({
      Name: key,
      Value: attributes[key],
    })),
  })

  return client.send(command)
}

export async function adminUpdateUserAttributes({
  username,
  attributes,
  UserPoolId,
}) {
  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: UserPoolId || process.env.USER_POOL_ID,
    Username: username,
    UserAttributes: Object.keys(attributes).map(key => ({
      Name: key,
      Value: attributes[key],
    })),
  })

  return client.send(command)
}

export async function resendConfirmationCode({ username }) {
  const command = new ResendConfirmationCodeCommand({
    ClientId: process.env.USER_POOL_CLIENT_ID,
    Username: username,
  })

  return client.send(command)
}
