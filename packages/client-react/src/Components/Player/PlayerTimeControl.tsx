import React from 'react'
import { EventType, Time, timeFromArgs } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, SliderChangeHandler, WithClassName } from "../../declarations"
import { Slider } from '../../Utilities/Slider'
import { useListeners } from '../../Hooks/useListeners'
import { useMashEditor } from '../../Hooks/useMashEditor'

export interface PlayerTimeControlProps extends PropsWithChildren, WithClassName { }

export function PlayerTimeControl(props: PlayerTimeControlProps): ReactResult {
  const masher = useMashEditor()
  useListeners({
    [EventType.Time]: () => { setFrame(masher.mash.frame) },
    [EventType.Duration]: () => { setFrames(masher.mash.frames) }
  })

  const [frames, setFrames] = React.useState(masher.mash.frames)
  const [frame, setFrame] = React.useState(masher.mash.frame)

  const onChange: SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
    masher.time = timeFromArgs(number, masher.mash.quantize)
  }

  const sliderProps = {
    value: frame,
    min: 0,
    max: frames,
    step: 1,
    onChange,
    className: 'frame slider',
    ...props
  }
  return <Slider {...sliderProps} />
}
