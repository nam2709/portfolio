import React, { useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SettingContext from '../../../Helper/SettingContext'
import I18NextContext from '@/Helper/I18NextContext'

const Logo = () => {
  const { state } = useContext(SettingContext)
  const { i18Lang } = useContext(I18NextContext)
  return (
    <Link href={`/${i18Lang}/dashboard`} className='d-center'>
        <h2 className="text-white">KAMARKET</h2>
    </Link>
  )
}

export default Logo
