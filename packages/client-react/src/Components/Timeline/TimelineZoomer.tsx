import React from 'react'
import { ReactResult, SliderChangeHandler, PropsWithChildren } from "../../declarations"
import { TimelineContext } from '../../Contexts/TimelineContext'
import { Slider } from '../../Utilities/Slider'
import { useEditor } from '../../Hooks/useEditor'
import { isArray } from '@moviemasher/moviemasher.js'


/**
 * @parents Timeline
 */
export function TimelineZoomer(props: PropsWithChildren): ReactResult {
  const editor = useEditor()
  const timelineContext = React.useContext(TimelineContext)

  const handleChange : SliderChangeHandler = (_event, values) => {
    const number = isArray(values) ? values[0] : values
    if (timelineContext.zoom !== number) timelineContext.setZoom(number)
  }

  const sliderProps = {
    disabled: !editor.selection.mash,
    key: 'time-slider',
    value: timelineContext.zoom,
    min: 0.0,
    max: 1.0,
    step: 0.01,
    onChange: handleChange,
    ...props
  }
  return <Slider className='zoom slider' {...sliderProps} />
}
