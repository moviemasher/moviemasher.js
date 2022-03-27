import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { DataType, Types } from '@moviemasher/moviemasher.js'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'

function DefaultModeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const selected = String(value)

  const options = Types.propertyType(DataType.Mode).values.map(object => {
    const { id, label } = object
    const optionProps = { value: id, children: label, key: id }
    return <option {...optionProps}/>
  })

  const selectProps = {
    children: options,
    name: property.name,
    onChange,
    value: selected,
    key: `${property.name}-select`,
  }

  return <select {...selectProps} />

}

DataTypeInputs[DataType.Mode] = <DefaultModeInput />

export { DefaultModeInput }
