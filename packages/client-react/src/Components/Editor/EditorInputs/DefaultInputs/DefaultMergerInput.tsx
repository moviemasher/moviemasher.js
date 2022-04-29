import React from 'react'
import { DataType, Definitions } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'

function DefaultMergerInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null


  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value
    changeHandler(property.name, id)
  }
  const definitionId = String(value)

  const options = Definitions.merger.map(merger => {
    const optionProps = {
      value: merger.id,
      key: merger.id,
      children: merger.label,
      selected: merger.id === definitionId,
    }
    return <option {...optionProps}/>
  })

  const mergerProps = {
    children: options,
    name: property.name,
    onChange,
    key: `${property.name}-select`
  }
  return <select {...mergerProps} />
}

DataTypeInputs[DataType.Merger] = <DefaultMergerInput />


export { DefaultMergerInput }
