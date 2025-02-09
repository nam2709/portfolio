export function isAdmin(session) {
  // console.log(session?.tokens?.idToken?.payload['cognito:groups'])
  return (
    session &&
    session?.tokens &&
    session?.tokens?.idToken &&
    session?.tokens?.idToken?.payload['cognito:groups']?.includes('Admin')
  )
}

export function getHostApi() {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api'
  } else return process.env.API_PROD_URL
}
