import React, { useEffect } from 'react'
import { NumericFormat } from 'react-number-format'

function NumberPriceTotal({ value, style, setFieldValue }) {

  useEffect(() => {
    // Check if 'value' is a number
    if (typeof value !== 'number') {
      console.error("Invalid value type. Expected a number.");
      setFieldValue('total_web_amount', 0);
      return;
    }

    // If value is negative, set it to 0 and optionally handle the error
    if (value < 0) {
      console.warn("Negative value detected. Setting total_web_amount to 0.");
      setFieldValue('total_web_amount', 0);
      return;
    }

    // If value is valid and non-negative, set it normally
    setFieldValue('total_web_amount', value);
  }, [value, setFieldValue]);
  
  const displayValue = value < 0 ? 0 : value;
  return (
    <>
      <NumericFormat
        className={style}
        value={displayValue}
        displayType={'text'}
        thousandSeparator={true}
        prefix={''}
      />
      <span className={style}>&#8363;</span>
    </>
  )
}

export default NumberPriceTotal
