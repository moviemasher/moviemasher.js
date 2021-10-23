import React, { FC, ReactElement, useContext } from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { SliderChangeHandler } from "../../declarations"
import { TimelineContext } from './TimelineContext'

interface ZoomSliderProps extends UnknownObject{
  control: ReactElement
}

const ZoomSlider : FC<ZoomSliderProps> = (props) => {
  const context = useContext(TimelineContext)
  const { control, ...rest } = props

  const handleChange : SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
    if (context.zoom !== number) context.setZoom(number)
  }

  const frameOptions = {
    key: 'time-slider',
    value: context.zoom,
    min: 0.0,
    max: 1.0,
    step: 0.01,
    onChange: handleChange,
    ...rest
  }
  return React.cloneElement(control, frameOptions)
}

export { ZoomSlider, ZoomSliderProps }
