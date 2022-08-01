import React from 'react'
import { DataType, isDefined, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'

export function NumericTypeInput(): ReactResult {
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

DataTypeInputs[DataType.Number] = <NumericTypeInput />
DataTypeInputs[DataType.Frame] = <NumericTypeInput />
