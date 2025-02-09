import CognitoAdapter from 'adapters/cognito.adapter'

export default class UserService {
  constructor(adapter) {
    this.adapter = adapter || new CognitoAdapter({ region: process.env.AWS_REGION })
  }

  async handleAdminUser({action, username}) {
    console.log('action', action)
    console.log('username', username)
    switch (action) {
      case 'handleAdminDeleteUser':
        return this.handleAdminDeleteUser(username)
      case 'handleAdminDisableUser':
        return this.handleAdminDisableUser(username)
      case 'handleAdminEnableUser':
        return this.handleAdminEnableUser(username)
      case 'handleAdminGetUser': 
        return this.handleAdminGetUser(username)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  async handleAdminDeleteUser(username) {
    const result = await this.adapter.adminDeleteUser({
      userPoolId: process.env.USER_POOL_ID,
      userName: username
    })
    return result
  }

  async handleAdminDisableUser(username) {
    const result = await this.adapter.adminDisableUser({
      userPoolId: process.env.USER_POOL_ID,
      userName: username
    })
    return result
  }

  async handleAdminEnableUser(username) {
    const result = await this.adapter.adminEnableUser({
      userPoolId: process.env.USER_POOL_ID,
      userName: username
    })
    return result
  }

  async handleAdminGetUser(username) {
    const result = await this.adapter.adminGetUser({
      userPoolId: process.env.USER_POOL_ID,
      userName: username
    })
    return result
  }
}
