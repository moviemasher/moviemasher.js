import { DataType } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'

function DefaultNumericInput(): ReactResult {

  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const inputProps = {
    type: 'number',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    name: property.name,
    value: String(value),
    onChange,
  }
  return <input {...inputProps} />

}

DataTypeInputs[DataType.Number] = <DefaultNumericInput />

export { DefaultNumericInput }
