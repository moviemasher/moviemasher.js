import React from 'react'
import { assertTrue, DataType, FontType } from '@moviemasher/lib-core'


import { InputContext } from '../InputContext'
import { DataTypeInputs } from './DataTypeInputs'
import { useMasher } from '../../../../Hooks/useMasher'

export function DefinitionSelect() {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, value, name } = inputContext
  const editor = useMasher()
  const { media } = editor
  assertTrue(changeHandler)
  
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(name, event.target.value)
  }

  const options = media.byType(FontType).map(object => {
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
