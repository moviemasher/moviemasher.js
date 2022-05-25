import React from 'react'
import { DroppingPosition, isDefined, UnknownObject } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, WithClassName } from '../../declarations'
import { TimelineContext } from '../../Contexts/TimelineContext'
import { TrackContext } from '../../Contexts/TrackContext'
import { View } from '../../Utilities/View'
import { TimelineClip } from './TimelineClip'
import { EditorContext } from '../../Contexts/EditorContext'

export interface TimelineTrackProps extends PropsWithChildren, WithClassName {
  label?: string
}

/**
 * @parents TimelineTracks
 */
export function TimelineTrack(props: TimelineTrackProps): ReactResult {
  const { className: propsClassName, children, ...rest } = props
  const ref = React.useRef<HTMLDivElement>(null)
  const editorContext = React.useContext(EditorContext)
  const trackContext = React.useContext(TrackContext)
  const timelineContext = React.useContext(TimelineContext)
  const { editor, selectedClass, droppingPositionClass } = editorContext
  const {
    dragTypeValid, onDragLeave, onDrop, droppingTrack, setDroppingTrack,
    droppingPosition, setDroppingPosition, setDroppingClip, selectedTrack,
  } = timelineContext
  const { track } = trackContext
  const mash = editor?.selection.mash
  if (!(mash && track)) return null

  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `TimelineClips`

  const { clips, dense } = track

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

  const onDragOver: React.DragEventHandler = event => {
    const { dataTransfer } = event
    const definitionType = dragTypeValid(dataTransfer, track)
    setDroppingClip()
    setDroppingTrack(definitionType ? track : undefined)
    setDroppingPosition(definitionType ? DroppingPosition.At : DroppingPosition.None)
    event.stopPropagation()
    if (definitionType) event.preventDefault()
  }

  const calculatedClassName = (): string => {
    const selected = track === selectedTrack
    const classes: string[] = []
    if (propsClassName) classes.push(propsClassName)
    if (selected) classes.push(selectedClass)
    if (droppingTrack === track) classes.push(droppingPositionClass(droppingPosition))

    return classes.join(' ')
  }

  const className = React.useMemo(
    calculatedClassName, [droppingPosition, droppingTrack, selectedTrack]
  )

  const viewProps:UnknownObject = {
    className,
    children: childNodes(),
    ref,
    onDragLeave,
    onDragOver,
    onDrop,
  }

  return <View {...viewProps}/>
}
