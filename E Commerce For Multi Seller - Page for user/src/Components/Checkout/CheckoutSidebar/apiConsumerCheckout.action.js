import { getHostApi } from '@/Utils/AxiosUtils'
import { fetchAuthSession } from 'aws-amplify/auth'
  
const apiConsumerCheckout = async (values) => {
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(error => {
      console.error('ERROR GET TOKEN', error.message)
      return null
    })

  const response = await fetch(`${getHostApi()}cart/checkout`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
  });

  return response
}

export { apiConsumerCheckout }