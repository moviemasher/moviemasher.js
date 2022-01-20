import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from '../../../../declarations'

function DefaultRgbInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property, event.target.value)
  }

  const colorProps = {
    type: 'color',
    name: property,
    value: String(value),
    onChange,
  }

  return <input {...colorProps} />

}

export { DefaultRgbInput }
