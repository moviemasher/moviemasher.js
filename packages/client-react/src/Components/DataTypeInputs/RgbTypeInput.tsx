import React from 'react'
import { DataType, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'

export function RgbTypeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

  const { defaultValue } = property
  const colorProps: UnknownObject = {
    type: 'color',
    name,
    value: String(value || defaultValue),
  }
  if (changeHandler) {

    colorProps.onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      changeHandler(name, event.target.value)
    }
  } else colorProps.disabled = true
  return <input {...colorProps} />
}

DataTypeInputs[DataType.Rgb] = <RgbTypeInput />
