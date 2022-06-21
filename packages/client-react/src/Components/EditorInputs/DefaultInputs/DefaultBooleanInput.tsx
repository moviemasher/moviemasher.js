import { DataType } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../EditorInputs'

export function DefaultBooleanInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property.name, event.target.checked)
  }

  const inputProps = {
    type: 'checkbox',
    name: property.name,
    checked: !!value,
    onChange,
  }
  return <input {...inputProps} />

}

DataTypeInputs[DataType.Boolean] = <DefaultBooleanInput />
