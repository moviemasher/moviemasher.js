import React from "react"
import { ClassSelected, UnknownRecord } from "@moviemasher/moviemasher.js"


import { WithClassName } from "../../Types/Core"
import { PropsWithoutChild } from "../../Types/Props"
import { TimelineContext } from "./TimelineContext"
import { TrackContext } from "../../Contexts/TrackContext"
import { View } from "../../Utilities/View"
import { droppingPositionClass } from "@moviemasher/client-core"

export interface TimelineTrackIconProps extends PropsWithoutChild, WithClassName {
  icons: UnknownRecord
}
/**
 * @parents TimelineTracks
 * @children TimelineTracks, TimelineScrubber, TimelineScrubberElement, TimelineSizer
 */
export function TimelineTrackIcon(props: TimelineTrackIconProps) {
  const { className: propsClassName, icons, ...rest } = props
  const timelineContext = React.useContext(TimelineContext)
  const trackContext = React.useContext(TrackContext)
 

  const { droppingTrack, droppingPosition, selectedTrack } = timelineContext
  const { track } = trackContext

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

  if (!track) return null

  const { dense, index } = track
  
  const children = dense ? icons.trackDense : icons.track

  const viewProps = { 
    ...rest, className, children, key: `track-icon-${index}`
  }
  return <View {...viewProps} />
}
