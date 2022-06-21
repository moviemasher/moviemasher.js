import React from 'react'
import { DataType, isDefined, UnknownObject } from '@moviemasher/moviemasher.js'
import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../EditorInputs'

export function DefaultNumericInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const { min, max, step } = property
  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const inputProps: UnknownObject = {
    type: 'number',
    name: property.name,
    value: String(value),
    onChange,
  }
  if (isDefined(min)) inputProps.min = min
  if (isDefined(max)) inputProps.max = max
  if (isDefined(step)) inputProps.step = step

  return <input {...inputProps} />

}

DataTypeInputs[DataType.Number] = <DefaultNumericInput />
DataTypeInputs[DataType.Frame] = <DefaultNumericInput />
