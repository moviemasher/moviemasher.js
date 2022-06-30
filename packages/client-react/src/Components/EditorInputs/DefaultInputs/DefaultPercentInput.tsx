import { DataType, isArray } from '@moviemasher/moviemasher.js'
import React from 'react'
import { InputContext } from '../../../Contexts/InputContext'
import { ReactResult, SliderChangeHandler } from '../../../declarations'
import { Slider } from '../../../Utilities/Slider'
import { DataTypeInputs } from '../EditorInputs'

export function DefaultPercentInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value } = inputContext
  if (!property) return null

  const onChange: SliderChangeHandler = (_event, values) => {
    changeHandler(property.name, isArray(values) ? values[0] : values)
  }

  const inputProps = {
    type: 'checkbox',
    checked: !!value,
    onChange,
  }

  const sliderProps = {
    value: Number(value),
    min: 0.0,
    max: 1.0,
    step: 0.01,
    onChange,
    name: property.name,
  }
  return <Slider className='zoom slider' {...sliderProps} />
}

DataTypeInputs[DataType.Percent] = <DefaultPercentInput />
