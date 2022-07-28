import React from 'react'
import { InputContext } from '../../../Contexts/InputContext'
import { DataType, Modes, UnknownObject } from '@moviemasher/moviemasher.js'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../DataTypeInputs'

export function DefaultModeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value, name } = inputContext
  if (!property) return null


  const options = Modes.map((id, index) => {
    const optionProps = { value: index, children: id.replaceAll('-', ' '), key: id }
    return <option {...optionProps} />
  })

  const selectProps: UnknownObject = {
    className: 'mode',
    children: options,
    name,
    value: String(value),
    key: `${name}-select`,
  }
  if (changeHandler) {
    selectProps.onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(name, event.target.value)
  }
  } else selectProps.disabled = true

  
  return <select {...selectProps} />
}

DataTypeInputs[DataType.Mode] = <DefaultModeInput />
