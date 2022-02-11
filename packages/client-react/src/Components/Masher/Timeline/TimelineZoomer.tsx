import React from 'react'
import { ReactResult, SliderChangeHandler, PropsWithChildren } from "../../../declarations"
import { TimelineContext } from '../../../Contexts/TimelineContext'
import { Slider } from '../../../Utilities/Slider'


/**
 * @parents Timeline
 */
function TimelineZoomer(props: PropsWithChildren): ReactResult {
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
  return <Slider className='zoom slider' {...sliderProps} />
}

export { TimelineZoomer }
