import React from 'react'
import { assertMash, assertTrack, ClassSelected, DroppingPosition, eventStop, UnknownObject } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, WithClassName } from '../../declarations'
import { TimelineContext } from './TimelineContext'
import { TrackContext } from '../../Contexts/TrackContext'
import { View } from '../../Utilities/View'
import { TimelineClip } from './TimelineClip'
import { useEditor } from '../../Hooks/useEditor'
import { droppingPositionClass } from '../../Helpers/DragDrop'

export interface TimelineTrackProps extends PropsWithChildren, WithClassName {
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

  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `TimelineClips`


  const childNodes = (): React.ReactElement[] => {
    let prevClipEnd = dense ? -1 : 0
    return clips.map(clip => {
      const clipProps = {
        ...rest,
        prevClipEnd,
        key: clip.id,
        clip,
        children: kid,
      }
      if (!dense) prevClipEnd = clip.frames + clip.frame
      return <TimelineClip {...clipProps} />
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
    className,
    children: childNodes(),
    onDragLeave,
    onDragOver,
    onDrop,
    key: `track-${index}`
  }

  return <View {...viewProps}/>
}
