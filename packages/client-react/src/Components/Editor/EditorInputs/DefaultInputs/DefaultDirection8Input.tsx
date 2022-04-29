import React from 'react'
import { DataType, Directions } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../../Contexts/InputContext'
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

  const options = Directions.map((id, index) => {
    const optionProps = { value: index, children: id.replaceAll('-', ' '), key: id }
    return <option {...optionProps} />
  })

  const selectProps = {
    class: 'direction8',
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
