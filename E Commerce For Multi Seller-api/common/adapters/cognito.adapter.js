import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  ListUsersCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  GetUserCommand,
  AdminUpdateUserAttributesCommand,
  ListUsersInGroupCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminDeleteUserCommand
} from '@aws-sdk/client-cognito-identity-provider'
import { map } from 'lodash'

export default class CognitoAdapter {
  // userPoolId: string
  //   client

  constructor({ region }) {
    // this.userPoolId = userPoolId
    this.client = new CognitoIdentityProviderClient({
      region: region || process.env.AWS_REGION,
    })
  }

  async getUser({ accessToken }) {
    const params = {
      AccessToken: accessToken,
    }
    // console.log('GetUser', params)
    const command = new GetUserCommand(params)
    return this.client
      .send(command)
      .then(user => {
        let attributes = {}
        user.UserAttributes.forEach(attr => {
          attributes[attr.Name] = attr.Value
        })
        return attributes
      })
      .catch(error => {
        throw error
      })
  }

  async adminGetUser({ userPoolId, userName }) {
    const command = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: userName
    })
    return this.client.send(command)
  }

  async adminUpdateUser({ userPoolId, username, attributes }) {
    console.log(attributes)
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: map(attributes, (value, key) => ({
        Name: key,
        Value: value,
      })),
    })

    return this.client.send(command)
  }

  async listUsers({ userPoolId }) {
    const command = new ListUsersCommand({ UserPoolId: userPoolId })
    return this.client.send(command)
  }

  async signUp({ clientId, username, password, email }) {
    const command = new SignUpCommand({
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    })
    return this.client.send(command)
  }

  async confirmSignUp({ clientId, username, code }) {
    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: username,
      ConfirmationCode: code,
    })
    return this.client.send(command)
  }

  async adminListUsersInGroup({ userPoolId, groupName, limit, nextToken }) {
    const command = new ListUsersInGroupCommand({
      UserPoolId: userPoolId,
      GroupName: groupName,
      Limit: limit,
      NextToken: nextToken,
    })
    return this.client.send(command)
  }

  async adminDeleteUser({ userPoolId, userName }) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: userName
    })
    return this.client.send(command)
  }

  async adminDisableUser({ userPoolId, userName }) {
    const command = new AdminDisableUserCommand({
      UserPoolId: userPoolId,
      Username: userName
    })
    return this.client.send(command)
  }

  async adminEnableUser({ userPoolId, userName }) {
    const command = new AdminEnableUserCommand({
      UserPoolId: userPoolId,
      Username: userName
    })
    return this.client.send(command)
  }
}
