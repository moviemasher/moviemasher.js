import React from 'react'
import { DataType, DirectionLabels, UnknownObject } from '@moviemasher/moviemasher.js'

import { PropsWithoutChild, ReactResult } from '../../../declarations'
import { InputContext } from '../../../Contexts/InputContext'
import { DataTypeInputs } from '../DataTypeInputs'

export function DefaultDirection4Input(props:PropsWithoutChild): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

 

  const options = DirectionLabels.slice(0, 3).map((id, index) => {
    const optionProps = { value: index, children: id, key: id }
    return <option {...optionProps} />
  })

  const selectProps: UnknownObject = {
    className: 'direction4',
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

DataTypeInputs[DataType.Direction4] = <DefaultDirection4Input />
