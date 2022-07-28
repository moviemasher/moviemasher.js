import { DataType, UnknownObject } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../DataTypeInputs'

export function DefaultTextInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

  const inputProps: UnknownObject = {
    type: 'text',
    name,
    value: String(value),
  }
  if (changeHandler) {
    inputProps.onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      changeHandler(name, event.target.value)
    }
  } else inputProps.disabled = true
  return <input {...inputProps} />

}

DataTypeInputs[DataType.String] = <DefaultTextInput />
DataTypeInputs[DataType.Orientation] = <DefaultTextInput />
