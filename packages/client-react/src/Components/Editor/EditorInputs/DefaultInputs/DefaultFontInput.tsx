import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { DataType, DefinitionType } from '@moviemasher/moviemasher.js'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'
import { useEditor } from '../../../../Hooks/useEditor'

export function DefaultFontInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const editor = useEditor()

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const selectedFont = String(value)

  const options = editor.definitions.byType(DefinitionType.Font).map(object => {
    const { id, label } = object
    const optionProps = { value: id, children: label, key: id }
    return <option {...optionProps}/>
  })

  const selectProps = {
    children: options,
    name: property.name,
    onChange,
    value: selectedFont,
    key: `${property.name}-select`,
  }

  return <select {...selectProps} />

}

DataTypeInputs[DataType.Font] = <DefaultFontInput/>
