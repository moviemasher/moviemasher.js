import React from 'react'
import { DataType, isArray, isDefined, isNumber, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult, SliderChangeHandler } from '../../../../declarations'
import { InputContext } from '../InputContext'
import { Slider } from '../../../../Utilities/Slider'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'
import { useEditor } from '../../../../Hooks/useEditor'

export function PercentTypeInput(): ReactResult {
  const editor = useEditor()
  const inputContext = React.useContext(InputContext)
  const { changeHandler, property, value: contextValue, name, time, defaultValue: contextDefault  } = inputContext
  if (!property) return null

  const { max, min, step, defaultValue: propertyDefault } = property
  const value = isDefined(contextValue) ? contextValue : (isDefined(contextDefault) ? contextDefault : propertyDefault)
  const sliderProps: UnknownObject = {
    value,
    min: isNumber(min) ? min : 0.0,
    max: isNumber(max) ? max : 1.0,
    step: isNumber(step) ? step : 0.01,
    name,
  }
  if (changeHandler) {
    const onChange: SliderChangeHandler = async (_event, values) => {
      const value = isArray(values) ? values[0] : values
      if (time) await editor.goToTime(time)
      changeHandler(name, value)
    }
    sliderProps.onChange = onChange
  } else sliderProps.disabled = true

  return <Slider className='slider' {...sliderProps} />
}

DataTypeInputs[DataType.Percent] = <PercentTypeInput />
