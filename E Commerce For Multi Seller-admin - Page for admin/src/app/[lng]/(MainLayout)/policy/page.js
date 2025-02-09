'use client'
import PolicyForm from '@/Components/Policy/PolicyForm'

import { useState } from 'react'

const PolicyCreate = () => {
  const [resetKey, setResetKey] = useState(false)

  return <PolicyForm setResetKey={setResetKey} title={'AddPolicy'} key={resetKey} />
}

export default PolicyCreate
