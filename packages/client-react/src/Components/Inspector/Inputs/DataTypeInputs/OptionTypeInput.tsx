import React from 'react'
import { DataType, UnknownRecord, assertPopulatedArray } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'
import { InputContext } from '../InputContext'

export function OptionTypeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value, name } = inputContext
  const { options } = property
  assertPopulatedArray(options)

  const ids = options.map(String)
  const selectProps: UnknownRecord = {
    children: ids.map(id => {
    const optionProps = { value: id, children: id, key: id }
    return <option {...optionProps} />
  }),
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

DataTypeInputs[DataType.Option] = <OptionTypeInput />
