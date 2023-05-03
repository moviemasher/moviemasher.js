import React from 'react'
import { EventTypeDuration, EventTypeTime, isArray, timeFromArgs, TimeRange } from '@moviemasher/lib-core'


import { SliderChangeHandler } from "../../Types/Core"
import { PropsWithChildren } from "../../Types/Props"
import { Slider } from '../../Utilities/Slider'
import { useMasher } from '../../Hooks/useMasher'
import { useListeners } from '../../Hooks/useListeners'


export function PlayerTimeControl(props: PropsWithChildren) {
  const masher = useMasher()
  const getTimeRange = () => masher.timeRange.timeRange
  const [timeRange, setTimeRange] = React.useState<TimeRange>(getTimeRange)

  const update = () => { setTimeRange(getTimeRange())}
  useListeners({
    [EventTypeTime]: update,
    [EventTypeDuration]: update,
  })
 
  const onChange: SliderChangeHandler = (values) => {
    const number = isArray(values) ? values[0] : Number(values)
    masher.time = timeFromArgs(number, timeRange.fps)
  }

  const { mashMedia } = masher
  const disabled = !(mashMedia && timeRange.frames)

  const sliderProps = {
    disabled,
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
