import React from 'react'
import { 
  assertMash, assertTrack, assertTrue, ClassSelected, DroppingPosition, 
  eventStop, UnknownObject 
} from '@moviemasher/moviemasher.js'

import { PropsAndChild, ReactResult, WithClassName } from '../../declarations'
import { TimelineContext } from './TimelineContext'
import { TrackContext } from '../../Contexts/TrackContext'
import { View } from '../../Utilities/View'
import { useEditor } from '../../Hooks/useEditor'
import { droppingPositionClass } from '../../Helpers/DragDrop'
import { ClipContext } from '../ClipItem/ClipContext'

export interface TimelineTrackProps extends PropsAndChild, WithClassName {
  label?: string
}

/**
 * @parents TimelineTracks
 */
export function TimelineTrack(props: TimelineTrackProps): ReactResult {
  const editor = useEditor()
  const { selection } = editor
  const { mash } = selection
 
  const { className: propsClassName, children, ...rest } = props
  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child))

  const trackContext = React.useContext(TrackContext)
  const timelineContext = React.useContext(TimelineContext)
  const { track } = trackContext

  assertMash(mash)
  assertTrack(track)

  const { clips, dense, index } = track
  
  const {
    dragTypeValid, onDragLeave, onDrop, droppingTrack, setDroppingTrack,
    droppingPosition, setDroppingPosition, setDroppingClip, selectedTrack,
  } = timelineContext

  const calculatedClassName = (): string => {
    const selected = track === selectedTrack
    const classes: string[] = []
    if (propsClassName) classes.push(propsClassName)
    if (selected) classes.push(ClassSelected)
    if (droppingTrack === track) classes.push(droppingPositionClass(droppingPosition))
    return classes.join(' ')
  }

  const className = React.useMemo(
    calculatedClassName, [droppingPosition, droppingTrack, selectedTrack]
  )

  const childNodes = (): React.ReactElement[] => {
    let prevClipEnd = dense ? -1 : 0
    const childProps = child.props
    return clips.map(clip => {
      const cloneProps = { ...childProps, key: clip.id }
      const children = React.cloneElement(child, cloneProps)
      const contextProps = { children, value: { clip, prevClipEnd }, key: clip.id }
      const context = <ClipContext.Provider { ...contextProps } />
      if (!dense) prevClipEnd = clip.frames + clip.frame
      return context
    })
  }

  const onDragOver = (event: DragEvent) => {
    eventStop(event)
    const { dataTransfer } = event
    if (!dataTransfer) return

    const definitionType = dragTypeValid(dataTransfer)
    const pos = definitionType ? DroppingPosition.At : DroppingPosition.None
    setDroppingClip()
    setDroppingTrack(definitionType ? track : undefined)
    setDroppingPosition(pos)
  }

  const viewProps:UnknownObject = {
    ...rest,
    className,
    children: childNodes(),
    onDragLeave, onDragOver, onDrop,
    key: `track-${index}`
  }

  return <View {...viewProps}/>
}
