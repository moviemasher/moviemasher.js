import React, { FC, useEffect, useRef, ReactElement, useContext } from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { SliderChangeHandler } from "../declarations"
import { AppContext } from '../AppContext'

interface TimeSliderProps extends UnknownObject{
  control: ReactElement
}

const TimeSlider : FC<TimeSliderProps> = (props) => {
  const context = useContext(AppContext)
  const { control, ...rest } = props

  const handleChangeFrame : SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
    if (context.timeRange.frame !== number) {
      context.setTime(context.timeRange.withFrame(number))
    }
  }

  const frameOptions = {
    key: 'time-slider',
    value: context.timeRange.frame,
    min: 0,
    max: context.timeRange.frames,
    step: 1,
    onChange: handleChangeFrame,
    ...rest
  }
  return React.cloneElement(control, frameOptions)
}

export { TimeSlider, TimeSliderProps }
