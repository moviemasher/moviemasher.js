import React from 'react'
import { DataType, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../../../declarations'
import { InputContext } from '../InputContext'
import { DataTypeInputs } from './DataTypeInputs'

export function BooleanTypeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

  const inputProps: UnknownObject = {
    type: 'checkbox',
    name,
    checked: !!value,
  }
  if (changeHandler) {
    inputProps.onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      changeHandler(name, event.target.checked)
    }
  } else inputProps.disabled = true
  return <input {...inputProps} />
}

DataTypeInputs[DataType.Boolean] = <BooleanTypeInput />
