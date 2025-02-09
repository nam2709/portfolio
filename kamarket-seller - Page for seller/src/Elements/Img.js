import { getHostApi } from '@/Utils/libs'
import Image from 'next/image'
import React from 'react'

const Img = props => {
  const newProps = { ...props, src: getHostApi() + '/' + props['src'] }
  return <Image {...newProps} />
}

export default Img
