import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from '../../../../declarations'

function DefaultTextInput(): ReactResult {

  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value } = inputContext

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property, event.target.value)
  }

  const inputProps = {
    type: 'text',
    name: property,
    value: String(value),
    onChange,
  }
  return <input {...inputProps} />

}

export { DefaultTextInput }