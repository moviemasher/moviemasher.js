import React from 'react'
import { assertTrue, DataType, Defined, DefinitionType } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'

export function DefinitionSelect(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, value, name } = inputContext

  assertTrue(changeHandler)
  
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
    name,
    onChange,
    value: String(value),
    key: `${name}-select`,
  }
  return <select {...selectProps} />
}

DataTypeInputs[DataType.FontId] = <DefinitionSelect />
