import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { DataType, Types } from '@moviemasher/moviemasher.js'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'


function DefaultDirection8Input(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const selected = String(value)

  const options = Types.propertyType(DataType.Direction8).values.map(object => {
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

DataTypeInputs[DataType.Direction8] = <DefaultDirection8Input />

export { DefaultDirection8Input }
