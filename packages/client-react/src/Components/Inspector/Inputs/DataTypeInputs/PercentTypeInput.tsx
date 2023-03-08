


import /* type */ { SliderChangeHandler } from "../../../../Types/Core"

import React from 'react'

import { DataType, assertScalar, isArray, isDefined, isNumber } from '@moviemasher/moviemasher.js'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'
import { InputContext } from '../InputContext'
import { Slider } from '../../../../Utilities/Slider'
import { useMasher } from '../../../../Hooks/useMasher'
import { useContext } from '../../../../Framework/FrameworkFunctions'

export function PercentTypeInput() {
  const masher = useMasher()
  const inputContext = useContext(InputContext)
  const { changeHandler, property, value: contextValue, name, time, defaultValue: contextDefault  } = inputContext
  if (!property) return null

  const { max = 1.0, min = 0.0, step = 0.01, defaultValue: propertyDefault } = property
  const value = isDefined(contextValue) ? contextValue : (isDefined(contextDefault) ? contextDefault : propertyDefault)

  const onChange: SliderChangeHandler = async (values) => {
    const value = isArray(values) ? values[0] : values
    if (time) await masher.goToTime(time)
    changeHandler(name, value)
  }

  assertScalar(value, name)
  return <Slider className='slider' max={max} min={min} step={step}
    name={name} value={value} onChange={onChange} 
  />
}

DataTypeInputs[DataType.Percent] = <PercentTypeInput />
