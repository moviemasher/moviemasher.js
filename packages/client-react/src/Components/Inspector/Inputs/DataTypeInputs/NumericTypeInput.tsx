import React from 'react'
import { DataType, isDefined, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../../../declarations'
import { InputContext } from '../InputContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'
import { useEditor } from '../../../../Hooks/useEditor'

export function NumericTypeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const editor = useEditor()
  const { changeHandler, property, value, name, time } = inputContext
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
    inputProps.onChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      if (time) await editor.goToTime(time)
      changeHandler(name, value)
    }
  } else inputProps.disabled = true
  return <input {...inputProps} />

}

DataTypeInputs[DataType.Number] = <NumericTypeInput />
DataTypeInputs[DataType.Frame] = <NumericTypeInput />
