import { verifySession } from './user'

export async function fetchWishlist({ accessToken }) {
  return fetch(`${process.env.API_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .catch(error => {
      console.error('FAILED to fetch wishlist', error.message)
      return []
    })
}

export async function getWishlist() {
  const tokens = await verifySession()
  //   console.log('user-sessions', tokens)

  if (!tokens?.accessToken) {
    return null
  }

  return fetchWishlist({
    accessToken: tokens.accessToken.toString(),
  })
}
