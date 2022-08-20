import React from 'react'
import { DroppingPosition, eventStop, EventType, SelectType } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult } from '../../declarations'
import { useListeners } from '../../Hooks/useListeners'
import { useEditor } from '../../Hooks/useEditor'
import { View } from '../../Utilities/View'
import { TimelineContext } from './TimelineContext'

/**
 * @parents Timeline
 * @children TimelineTracks, TimelineScrubber, TimelineSizer
 */
export function TimelineContent(props: PropsWithChildren): ReactResult {
  const timelineContext = React.useContext(TimelineContext)

  const { 
    dragTypeValid, onDrop,
    setScroll, setDroppingClip, setDroppingTrack, setDroppingPosition 
  } = timelineContext
  const ref = React.useRef<HTMLDivElement>(null)
  const editor = useEditor()
  const resetScroll = () => { ref.current?.scrollTo(0, 0) }
  useListeners({ [EventType.Mash]: resetScroll })

  const onPointerDown = (event: React.MouseEvent<HTMLDivElement>) => { 
    editor.selection.unset(SelectType.Track) 
  }
  
  const onScroll = () => {
    const { current } = ref
    if (!current) return

    const { scrollLeft: x, scrollTop: y } = current
    setScroll({ x, y })
  }


  const onDragOver = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) return

    const definitionType = dragTypeValid(dataTransfer)
    const pos = definitionType ? DroppingPosition.At : DroppingPosition.None
    setDroppingClip()
    setDroppingTrack()
    setDroppingPosition(pos)
  }


  const viewProps = { 
    ...props, onPointerDown, onScroll, onDragOver, onDrop, ref 
  }
  return <View {...viewProps} />
}
