import React from 'react'
import { DataType, Types } from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../../../declarations'
import { InputContext } from '../../../../Contexts/InputContext'
import { DataTypeInputs } from './DataTypeInputs'

function DefaultDirection4Input(props:PropsWithoutChild): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const selected = String(value)

  const options = Types.propertyType(DataType.Direction4).values.map(object => {
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

DataTypeInputs[DataType.Direction4] = <DefaultDirection4Input />


export { DefaultDirection4Input }
