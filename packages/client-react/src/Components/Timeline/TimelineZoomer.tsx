import React from 'react'
import { ReactResult, SliderChangeHandler, PropsWithChildren } from "../../declarations"
import { TimelineContext } from './TimelineContext'
import { Slider } from '../../Utilities/Slider'
import { useEditor } from '../../Hooks/useEditor'
import { EventType, isArray } from '@moviemasher/moviemasher.js'
import { useListeners } from '../../Hooks/useListeners'


/**
 * @parents Timeline
 */
export function TimelineZoomer(props: PropsWithChildren): ReactResult {
  const editor = useEditor()
  const timelineContext = React.useContext(TimelineContext)
  const getDisabled = () => !editor.selection.mash
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Selection]: updateDisabled })

  const handleChange : SliderChangeHandler = (_event, values) => {
    const number = isArray(values) ? values[0] : values
    if (timelineContext.zoom !== number) timelineContext.setZoom(number)
  }


  const sliderProps = {
    disabled,
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
