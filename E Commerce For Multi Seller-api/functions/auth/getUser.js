export async function handleGetUser(event) {
  const userId = event.requestContext.authorizer.claims.sub

  const service = new UserService()

  return service
    .getUser(userId)
    .then(res => ({
      statusCode: 200,
      body: JSON.stringify(res),
    }))
    .catch(error => ({
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }))
}
