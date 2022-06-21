import React from "react"
import { ClassSelected, TrackTypes } from "@moviemasher/moviemasher.js"

import {
  EditorIcons, PropsWithoutChild, ReactResult, WithClassName
} from "../../declarations"
import { TimelineContext } from "../../Contexts/TimelineContext"
import { TrackContext } from "../../Contexts/TrackContext"
import { View } from "../../Utilities/View"
import { TimelineTrackIsType } from "./TimelineTrackIsType"
import { EditorContext } from "../../Contexts/EditorContext"

export interface TimelineTrackIcon extends PropsWithoutChild, WithClassName {
  icons: EditorIcons
}
/**
 * @parents TimelineTracks
 * @children TimelineTracks, TimelineScrubber, TimelineScrubberElement, TimelineSizer
 */
export function TimelineTrackIcon(props: TimelineTrackIcon): ReactResult {
  const { className: propsClassName, icons, ...rest } = props
  const editorContext = React.useContext(EditorContext)
  const timelineContext = React.useContext(TimelineContext)
  const trackContext = React.useContext(TrackContext)
  const { editor, droppingPositionClass } = editorContext
  if (!editor) return null

  const { droppingTrack, droppingPosition, selectedTrack } = timelineContext
  const { track } = trackContext

  const children = TrackTypes.map(type => {
    const stringType = String(type)
    const typeProps = { type, children: icons[stringType], key: stringType }
    return <TimelineTrackIsType { ...typeProps} />
  })

  const calculatedClassName = (): string => {
    const classes: string[] = []
    if (propsClassName) classes.push(propsClassName)
    if (track === selectedTrack) classes.push(ClassSelected)
    if (track === droppingTrack) classes.push(droppingPositionClass(droppingPosition))
    return classes.join(' ')
  }

  const className = React.useMemo(
    calculatedClassName, [droppingPosition, droppingTrack, selectedTrack]
  )

  const viewProps = { ...rest, className, children }
  return <View {...viewProps} />
}
