import AccountAddresses from '@/Components/Account/Addresses'
import { getAddresses } from '@/app/actions/address'
import { headers } from 'next/headers'

async function fetchAddresses() {
  const host = headers().get('host')
  const protocol = headers().get('x-forwarded-proto') || 'http'
  console.log('API ADDRESS', `${protocol}://${host}/api/address`)
  return fetch(`${protocol}://${host}/api/address`)
    .then(res => res.json())
    .catch(error => {
      console.error('GET ADDRESSSES ERROR', error.message)
      return []
    })
}

const Addresses = async () => {
  const addresses = await getAddresses()
  console.log('GET ADDRESSES', addresses)
  // console.log('FETCH ADDRESSES', await fetchAddresses())
  return <AccountAddresses addresses={addresses} />
}

export default Addresses
