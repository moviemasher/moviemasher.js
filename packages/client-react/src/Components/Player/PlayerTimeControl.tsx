import React from 'react'
import { EventType, isArray, timeFromArgs, TimeRange } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, SliderChangeHandler, WithClassName } from "../../declarations"
import { Slider } from '../../Utilities/Slider'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'

export interface PlayerTimeControlProps extends PropsWithChildren, WithClassName { }

export function PlayerTimeControl(props: PlayerTimeControlProps): ReactResult {
  const editor = useEditor()
  const getTimeRange = () => editor.timeRange.timeRange
  const [timeRange, setTimeRange] = React.useState<TimeRange>(getTimeRange)

  const update = () => { setTimeRange(getTimeRange())}
  useListeners({
    [EventType.Time]: update,
    [EventType.Duration]: update,
  }, editor.eventTarget)
 
  const onChange: SliderChangeHandler = (_event, values) => {
    const number = isArray(values) ? values[0] : values
    editor.time = timeFromArgs(number, timeRange.fps)
  }

  const sliderProps = {
    value: timeRange.frame,
    min: 0,
    max: timeRange.frames,
    step: 1,
    onChange,
    className: 'frame slider',
    ...props
  }
  return <Slider {...sliderProps} />
}
