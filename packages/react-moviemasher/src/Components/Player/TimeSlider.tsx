import React from 'react'

import { SliderChangeHandler } from "../../declarations"
import { EditorContext } from '../Editor/EditorContext'
import { Slider } from '../../Utilities/Slider'


const TimeSlider : React.FunctionComponent = (props) => {
  const editorContext = React.useContext(EditorContext)

  const { frame, frames, setFrame } = editorContext

  const handleChange: SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
    // console.log("handleChange", number, frame)
    if (frame !== number) setFrame(number)
  }

  const onChange = React.useCallback(handleChange, [frame])

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
