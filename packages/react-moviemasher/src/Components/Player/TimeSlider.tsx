import React from 'react'
import { EventType, Time } from '@moviemasher/moviemasher.js'

import { SliderChangeHandler } from "../../declarations"
import { Slider } from '../../Utilities/Slider'
import { useListeners } from '../../Hooks/useListeners'

const TimeSlider : React.FunctionComponent = (props) => {
  const { masher } = useListeners({
    [EventType.Time]: masher => { setFrame(masher.mash.frame) },
    [EventType.Duration]: masher => { setFrames(masher.mash.frames) }
  })

  const [frames, setFrames] = React.useState(masher.mash.frames)
  const [frame, setFrame] = React.useState(masher.mash.frame)

  const onChange: SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
    masher.time = Time.fromArgs(number, masher.mash.quantize)
  }

  const sliderProps = {
    value: frame,
    min: 0,
    max: frames,
    step: 1,
    onChange,
    ...props
  }
  return <Slider className='moviemasher-frame moviemasher-slider' {...sliderProps} />
}

export { TimeSlider }
