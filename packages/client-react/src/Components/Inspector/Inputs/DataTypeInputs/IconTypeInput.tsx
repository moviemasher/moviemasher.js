import React from 'react'
import { DataType, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'
import { InputContext } from '../InputContext'
import { MasherContext } from '../../../Masher/MasherContext'

export function IconTypeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  const names = Object.keys(icons)
  const { changeHandler, property, value, name } = inputContext
  if (!property) return null


  const options = names.map(id => {
    const optionProps = { value: id, children: id, key: id }
    return <option {...optionProps} />
  })

  const selectProps: UnknownObject = {
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

DataTypeInputs[DataType.Icon] = <IconTypeInput />
