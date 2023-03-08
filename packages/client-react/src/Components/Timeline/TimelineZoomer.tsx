import React from 'react'

import { SliderChangeHandler } from "../../Types/Core"
import { PropsWithChildren } from "../../Types/Props"
import { TimelineContext } from './TimelineContext'
import { Slider } from '../../Utilities/Slider'
import { useMasher } from '../../Hooks/useMasher'
import { EventType, isArray } from '@moviemasher/moviemasher.js'
import { useListeners } from '../../Hooks/useListeners'


/**
 * @parents Timeline
 */
export function TimelineZoomer(props: PropsWithChildren) {
  const editor = useMasher()
  const timelineContext = React.useContext(TimelineContext)
  const getDisabled = () => !editor.selection.mash
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Selection]: updateDisabled })

  const handleChange: SliderChangeHandler = (value) => {
    const number = isArray(value) ? value[0] : Number(value)
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
