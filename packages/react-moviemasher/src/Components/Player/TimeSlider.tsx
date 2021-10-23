import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { SliderChangeHandler } from "../../declarations"
import { MasherContext } from '../App/MasherContext'

interface TimeSliderProps extends UnknownObject {
  control: React.ReactElement
}

const TimeSlider : React.FC<TimeSliderProps> = (props) => {
  const masherContext = React.useContext(MasherContext)

  const { frame, frames, setFrame } = masherContext
  const { control, ...rest } = props

  const handleChange: SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
    console.log("handleChange", number, frame)
    if (frame !== number) setFrame(number)
  }

  const onChange = React.useCallback(handleChange, [frame])

  const frameOptions = {
    value: frame,
    min: 0,
    max: frames,
    step: 1,
    onChange,
    ...rest
  }

  return React.cloneElement(control, frameOptions)
}

export { TimeSlider, TimeSliderProps }
