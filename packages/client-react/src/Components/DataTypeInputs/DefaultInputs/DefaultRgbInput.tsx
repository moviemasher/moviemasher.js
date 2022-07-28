import { DataType, UnknownObject } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../DataTypeInputs'

export function DefaultRgbInput(): ReactResult {
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

DataTypeInputs[DataType.Rgb] = <DefaultRgbInput />
