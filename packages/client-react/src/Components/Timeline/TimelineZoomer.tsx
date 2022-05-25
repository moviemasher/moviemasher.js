import React from 'react'
import { ReactResult, SliderChangeHandler, PropsWithChildren } from "../../declarations"
import { TimelineContext } from '../../Contexts/TimelineContext'
import { Slider } from '../../Utilities/Slider'
import { useEditor } from '../../Hooks/useEditor'


/**
 * @parents Timeline
 */
export function TimelineZoomer(props: PropsWithChildren): ReactResult {
  const editor = useEditor()
  const timelineContext = React.useContext(TimelineContext)

  const handleChange : SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
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
