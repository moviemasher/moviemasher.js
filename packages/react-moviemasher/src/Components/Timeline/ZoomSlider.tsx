import React from 'react'
import { SliderChangeHandler } from "../../declarations"
import { TimelineContext } from './TimelineContext'
import { Slider } from '../../Utilities/Slider'

const ZoomSlider : React.FunctionComponent = (props) => {
  const context = React.useContext(TimelineContext)

  const handleChange : SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
    if (context.zoom !== number) context.setZoom(number)
  }

  const sliderProps = {
    key: 'time-slider',
    value: context.zoom,
    min: 0.0,
    max: 1.0,
    step: 0.01,
    onChange: handleChange,
    ...props
  }
  return <Slider className='moviemasher-zoom moviemasher-slider' {...sliderProps} />
}

export { ZoomSlider }
