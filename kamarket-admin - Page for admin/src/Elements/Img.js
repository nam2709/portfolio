import { getHost } from '@/Utils/server-utils'
import Image from 'next/image'
import React from 'react'

const Img = props => {
  const newProps = {
    ...props,
    src: getHost() + '/' + props['src'],
  }
  return <Image {...newProps} />
}

export default Img
