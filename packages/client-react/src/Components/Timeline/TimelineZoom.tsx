import React from 'react'
import { EventType } from '@moviemasher/moviemasher.js'

import { ReactResult, PropsAndChild, WithClassName } from "../../declarations"
import { TimelineContext } from './TimelineContext'
import { useEditor } from '../../Hooks/useEditor'
import { useListeners } from '../../Hooks/useListeners'

export interface TimelineZoomProps extends PropsAndChild, WithClassName {
  zoom: number
}

/**
 * @parents Timeline
 */
export function TimelineZoom(props: TimelineZoomProps): ReactResult {
  const editor = useEditor()
  const { zoom, children, ...rest } = props
  const timelineContext = React.useContext(TimelineContext)
  const getDisabled = () => !editor.selection.mash
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Selection]: updateDisabled })

  const onClick = () => { timelineContext.setZoom(zoom) }

  const buttonOptions = { ...rest, onClick, disabled }

  return React.cloneElement(React.Children.only(children), buttonOptions)
}
