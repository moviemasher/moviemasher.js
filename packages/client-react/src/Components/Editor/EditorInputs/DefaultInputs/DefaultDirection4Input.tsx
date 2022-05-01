import React from 'react'
import { DataType, Directions } from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../../../declarations'
import { InputContext } from '../../../../Contexts/InputContext'
import { DataTypeInputs } from './DataTypeInputs'

export function DefaultDirection4Input(props:PropsWithoutChild): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const options = Directions.slice(0, 3).map((id, index) => {
    const optionProps = { value: index, children: id.replaceAll('-', ' '), key: id }
    return <option {...optionProps} />
  })

  const selectProps = {
    class: 'direction4',
    children: options,
    name: property.name,
    onChange,
    value: String(value),
    key: `${property.name}-select`,
  }
  return <select {...selectProps} />
}

DataTypeInputs[DataType.Direction4] = <DefaultDirection4Input />
