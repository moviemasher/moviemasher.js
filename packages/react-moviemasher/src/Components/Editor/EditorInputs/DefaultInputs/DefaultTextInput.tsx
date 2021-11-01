import React from 'react'
import { InputContext } from '../../../Inspector/InputContext'

const DefaultTextInput: React.FunctionComponent = () => {
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
