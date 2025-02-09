import { verifyAuthorization, verifySession } from '@/app/actions/user'
// import user from './user.json'
import { NextResponse } from 'next/server'
import parsePhoneNumber from 'libphonenumber-js'

export async function GET(request, { params }) {
  const authorization = await verifyAuthorization(request)

  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await fetch(`${process.env.API_URL}/admin/users`, {
    headers: {
      Authorization: authorization,
    },
  })
    .then(response => response.json())
    .catch(error => {
      console.error('error while fetching users', error?.message || JSON.stringify(error))
      return { data: [], total: 0 }
    })

  const data = users.data.map(user => {
    let result = { ...user }
    user.Attributes.forEach(attr => {
      result[attr.Name] = attr.Value
    })
    result.id = result.Username
    result.created_at = result.UserCreateDate
    result.updated_at = result.UserLastModifiedDate
    result.status = result.Enabled ? 1 : 0

    const phone = parsePhoneNumber(`${result.phone_number}`, 'VN')
    if (phone) {
      result.phone = phone.formatNational()
    } else {
      result.phone = result.phone_number
    }

    delete result.Attributes
    return result
  }).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  // console.dir({ users, data }, { depth: 5 })

  return NextResponse.json({ data, total: data?.length || 0 })
}
