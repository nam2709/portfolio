import React from 'react'
import { NumericFormat } from 'react-number-format'

function NumberPrice({ value, style }) {
  return (
    <>
      <NumericFormat
        className={style}
        value={value}
        displayType={'text'}
        thousandSeparator={true}
        prefix={''}
      />
      <span className={style}>&#8363;</span>
    </>
  )
}

export default NumberPrice
