import { DataType } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../../Contexts/InputContext'

import { ReactResult, PropsWithoutChild } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'


interface DefaultFrameInputProps extends PropsWithoutChild {
  min?: number
  max?: number
}

function DefaultFrameInput(props: DefaultFrameInputProps): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    changeHandler(property.name, event.target.value)
  }

  const min = 0
  const max = 1
  const disabled = false

  const rangeProps = {
    type: 'range',
    min,
    max,
    step: 1,
    disabled,
    name: property.name,
    value: String(value),
    onChange,
  }

  return <input {...rangeProps} />

}

// DataTypeInputs[DataType.Frame] = <DefaultFrameInput />


export { DefaultFrameInput, DefaultFrameInputProps }
