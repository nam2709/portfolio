import { fetchAuthSession } from 'aws-amplify/auth'

const apiCreateZaloPay = async (payment) => {
  const token = await fetchAuthSession()
    .then(session => session?.tokens?.idToken?.toString())
    .catch(error => {
      console.error('ERROR GET TOKEN', error.message)
      return null
    })

  const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_API}/payments/zalo-pay`, {
      method: "POST",
      headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payment)
  });

  return response
}

export { apiCreateZaloPay }