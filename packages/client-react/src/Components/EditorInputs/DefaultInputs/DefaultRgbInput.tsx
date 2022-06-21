import { DataType } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../EditorInputs'

export function DefaultRgbInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const colorProps = {
    type: 'color',
    name: property.name,
    value: String(value),
    onChange,
  }

  return <input {...colorProps} />
}

DataTypeInputs[DataType.Rgb] = <DefaultRgbInput />
