import React from 'react'
import { DataType, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'

export function TextTypeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

  const inputProps: UnknownObject = {
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
