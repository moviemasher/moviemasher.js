import React from 'react'
import { timeFromArgs } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, SliderChangeHandler, WithClassName } from "../../declarations"
import { Slider } from '../../Utilities/Slider'
import { useEditor } from '../../Hooks/useEditor'
import { EditorContext } from '../../Contexts/EditorContext'

export interface PlayerTimeControlProps extends PropsWithChildren, WithClassName { }

export function PlayerTimeControl(props: PlayerTimeControlProps): ReactResult {
  const editorContext = React.useContext(EditorContext)
  const { frames, frame } = editorContext
  const editor = useEditor()

  const onChange: SliderChangeHandler = (_event, value) => {
    const number = typeof value === "number" ? value : value[0]
    editor.time = timeFromArgs(number, editor.timeRange.fps)
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
