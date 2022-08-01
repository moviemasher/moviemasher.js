import React from 'react'
import { DataType, isArray, isDefined, isNumber, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult, SliderChangeHandler } from '../../declarations'
import { InputContext } from '../../Contexts/InputContext'
import { Slider } from '../../Utilities/Slider'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'

export function PercentTypeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value: valueOrNot, name } = inputContext
  if (!property) return null

  const { max, min, step, defaultValue } = property
  const value = Number(isDefined(valueOrNot) ? valueOrNot : defaultValue)
  const sliderProps: UnknownObject = {
    value,
    min: isNumber(min) ? min : 0.0,
    max: isNumber(max) ? max : 1.0,
    step: isNumber(step) ? step : 0.01,
    name,
  }
  if (changeHandler) {
    const onChange: SliderChangeHandler = (_event, values) => {
      changeHandler(name, isArray(values) ? values[0] : values)
    }
    sliderProps.onChange = onChange
  } else sliderProps.disabled = true

  return <Slider className='zoom slider' {...sliderProps} />
}

DataTypeInputs[DataType.Percent] = <PercentTypeInput />
