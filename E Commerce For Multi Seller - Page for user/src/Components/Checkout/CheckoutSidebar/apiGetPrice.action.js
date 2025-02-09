import { fetchAuthSession } from 'aws-amplify/auth'

const apiGetPrice = async (values, cart) => {
  const token = await fetchAuthSession()
  .then(session => session?.tokens?.idToken?.toString())
  .catch(error => {
    console.error('ERROR GET TOKEN', error.message)
    return null
  })

  const response = await fetch(`${process.env.NEXT_PUBLIC_SHIP_API}/price/viettelpost`, {
      method: "POST",
      headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({...values, cart_items: cart})
  });

  return response
}

export { apiGetPrice }