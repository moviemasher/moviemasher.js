import { DataType } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'

function DefaultTextInput(): ReactResult {

  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const inputProps = {
    type: 'text',
    name: property.name,
    value: String(value),
    onChange,
  }
  return <input {...inputProps} />

}

DataTypeInputs[DataType.String] = <DefaultTextInput />

export { DefaultTextInput }
