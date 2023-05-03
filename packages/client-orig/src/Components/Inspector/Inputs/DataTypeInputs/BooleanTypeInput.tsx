import React from 'react'
import type {  UnknownRecord } from '@moviemasher/lib-core'

import { DataTypeBoolean } from '@moviemasher/lib-core'


import { InputContext } from '../InputContext'
import { DataTypeInputs } from './DataTypeInputs'

export function BooleanTypeInput() {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

  const inputProps: UnknownRecord = {
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

DataTypeInputs[DataTypeBoolean] = <BooleanTypeInput />
