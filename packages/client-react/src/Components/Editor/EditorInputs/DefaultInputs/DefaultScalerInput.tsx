import React from 'react'
import { DataType, DefinitionType } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../../Contexts/InputContext'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'
import { useEditor } from '../../../../Hooks/useEditor'

export function DefaultScalerInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const editor = useEditor()

  const { changeHandler, property, value } = inputContext
  if (!property) return null


  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value
    changeHandler(property.name, id)
  }
  const definitionId = String(value)

  const options = editor.definitions.byType(DefinitionType.Scaler).map(scaler => {
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
