import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { DataType, Types } from '@moviemasher/moviemasher.js'
import { PropsWithoutChild, ReactResult } from '../../../../declarations'

function DefaultDirection4Input(props:PropsWithoutChild): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(property, event.target.value)
  }

  const selected = String(value)

  const options = Types.propertyType(DataType.Direction4).values.map(object => {
    const { id, label } = object
    const optionProps = { value: id, children: label, key: id }
    return <option {...optionProps}/>
  })

  const selectProps = {
    children: options,
    name: property,
    onChange,
    value: selected,
    key: `${property}-select`,
  }

  return <select {...selectProps} />

}

export { DefaultDirection4Input }
