import React from 'react'
import { DataType, UnknownRecord } from '@moviemasher/moviemasher.js'


import { InputContext } from '../InputContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'

export function TextTypeInput() {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

  const inputProps: UnknownRecord = {
    name, type: 'text', value: String(value)
  }
  if (changeHandler) {
    inputProps.onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      changeHandler(name, event.target.value)
    }
  } else inputProps.disabled = true
  return <input {...inputProps} />
}

DataTypeInputs[DataType.String] = <TextTypeInput />
