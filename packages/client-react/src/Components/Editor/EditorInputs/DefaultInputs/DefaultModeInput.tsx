import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { DataType, Modes } from '@moviemasher/moviemasher.js'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'

function DefaultModeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const options = Modes.map((id, index) => {
    const optionProps = { value: index, children: id.replaceAll('-', ' '), key: id }
    return <option {...optionProps} />
  })

  const selectProps = {
    class: 'mode',
    children: options,
    name: property.name,
    onChange,
    value: String(value),
    key: `${property.name}-select`,
  }
  return <select {...selectProps} />
}

DataTypeInputs[DataType.Mode] = <DefaultModeInput />

export { DefaultModeInput }
