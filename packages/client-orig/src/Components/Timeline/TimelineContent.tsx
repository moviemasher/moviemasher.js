import React from 'react'
import { ClassDropping, DroppingPosition, eventStop, EventType, TrackType } from '@moviemasher/moviemasher.js'


import { PropsWithChildren } from "../../Types/Props"
import { useListeners } from '../../Hooks/useListeners'
import { useMasher } from '../../Hooks/useMasher'
import { View } from '../../Utilities/View'
import { TimelineContext } from './TimelineContext'

/**
 * @parents Timeline
 * @children TimelineTracks, TimelineScrubber, TimelineSizer
 */
export function TimelineContent(props: PropsWithChildren) {
  const { className, ...rest } = props

  const timelineContext = React.useContext(TimelineContext)

  const { 
    dragTypeValid, onDrop: contextDrop,
    setScroll, setDroppingClip, setDroppingTrack, setDroppingPosition 
  } = timelineContext
  const ref = React.useRef<HTMLDivElement>(null)
  const [over, setOver] = React.useState(false)

  const editor = useMasher()
  const resetScroll = () => { ref.current?.scrollTo(0, 0) }
  useListeners({ [EventType.Loaded]: resetScroll })

  const onPointerDown = () => { 
    editor.selection.unset(TrackType) 
  }
  
  const onScroll = () => {
    const { current } = ref
    if (!current) return

    const { scrollLeft: x, scrollTop: y } = current
    setScroll({ x, y })
  }

  const onDragLeave = (event: DragEvent): void => {
    eventStop(event)
    setOver(false)
  }


  const onDrop = (event: DragEvent): void => {
    onDragLeave(event)
    contextDrop(event)
  }

  const onDragOver = (event: DragEvent) => {
    eventStop(event)

    const { dataTransfer } = event
    if (!dataTransfer) return

    const valid = dragTypeValid(dataTransfer)
    const pos = valid ? DroppingPosition.At : DroppingPosition.None
    setDroppingClip()
    setDroppingTrack()
    setDroppingPosition(pos)
    setOver(valid)
  }

  const classes: string[] = []
  if (className) classes.push(className)
  if (over) classes.push(ClassDropping)


  const viewProps = { 
    className: classes.join(' '),
    ...rest, onPointerDown, onScroll, onDragOver, onDragLeave, onDrop, ref 
  }
  return <View {...viewProps} />
}
