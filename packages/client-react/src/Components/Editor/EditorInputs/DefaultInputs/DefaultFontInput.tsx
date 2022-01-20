import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'
import { Definitions } from '@moviemasher/moviemasher.js'
import { ReactResult } from '../../../../declarations'

function DefaultFontInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeHandler(property, event.target.value)
  }

  const selectedFont = String(value)

  const options = Definitions.font.map(object => {
    const { id, label } = object
    const optionProps = { value: id, children: label, key: id }
    return <option {...optionProps}/>
  })

  const selectProps = {
    children: options,
    name: property,
    onChange,
    value: selectedFont,
    key: `${property}-select`,
  }

  return <select {...selectProps} />

}

export { DefaultFontInput }
