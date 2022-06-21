import React from 'react'
import { DataType, Defined, DefinitionType } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../EditorInputs'

export function DefinitionSelect(): ReactResult {
  const inputContext = React.useContext(InputContext)


  const { changeHandler, property, value } = inputContext

  const { name, type } = property

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(name, event.target.value)
  }

  const options = Defined.byType(DefinitionType.Font).map(object => {
    const { id, label } = object
    const optionProps = { value: id, children: label, key: id }
    return <option {...optionProps}/>
  })

  const selectProps = {
    children: options,
    name: name,
    onChange,
    value: String(value),
    key: `${name}-select`,
  }
  return <select {...selectProps} />
}

DataTypeInputs[DataType.FontId] = <DefinitionSelect />
