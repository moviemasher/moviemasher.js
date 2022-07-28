import React from 'react'
import { DataType, DirectionLabels, UnknownObject } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../DataTypeInputs'


export function DefaultDirection8Input(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

 
  const selected = String(value)

  const options = DirectionLabels.map((id, index) => {
    const optionProps = { value: index, children: id, key: id }
    return <option {...optionProps} />
  })

  const selectProps: UnknownObject = {
    className: 'direction8',
    children: options,
    name,
    value: selected,
    key: `${name}-select`,
  }

  if (changeHandler) { 
    selectProps.onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      changeHandler(name, event.target.value)
    }
  } else selectProps.disabled = true
  return <select {...selectProps} />
}

DataTypeInputs[DataType.Direction8] = <DefaultDirection8Input />
