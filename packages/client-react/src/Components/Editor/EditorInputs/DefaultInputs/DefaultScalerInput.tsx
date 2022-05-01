import React from 'react'
import { DataType, Definitions } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'

export function DefaultScalerInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null


  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value
    changeHandler(property.name, id)
  }
  const definitionId = String(value)

  const options = Definitions.scaler.map(scaler => {
    const optionProps = {
      value: scaler.id,
      key: scaler.id,
      children: scaler.label,
      selected: scaler.id === definitionId,
    }
    return <option {...optionProps}/>
  })

  const scalerProps = {
    children: options,
    name: property.name,
    onChange,
    key: `${property.name}-select`
  }
  return <select {...scalerProps} />

}

DataTypeInputs[DataType.Scaler] = <DefaultScalerInput />
