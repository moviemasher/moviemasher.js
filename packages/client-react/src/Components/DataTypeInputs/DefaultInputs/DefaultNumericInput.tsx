import React from 'react'
import { DataType, isDefined, UnknownObject } from '@moviemasher/moviemasher.js'
import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../DataTypeInputs'

export function DefaultNumericInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

  const { min, max, step } = property


  const inputProps: UnknownObject = {
    type: 'number',
    name,
    value: String(value),
  }
  if (isDefined(min)) inputProps.min = min
  if (isDefined(max)) inputProps.max = max
  if (isDefined(step)) inputProps.step = step

  if (changeHandler) {
    inputProps.onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      changeHandler(name, event.target.value)
    }
  } else inputProps.disabled = true
  return <input {...inputProps} />

}

DataTypeInputs[DataType.Number] = <DefaultNumericInput />
DataTypeInputs[DataType.Frame] = <DefaultNumericInput />
