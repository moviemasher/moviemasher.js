import React from 'react'
import { EventType, TrackType, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../Utilities/View'
import { TimelineTrack } from './TimelineTrack'
import { useListeners } from '../../Hooks/useListeners'

const TimelineTracks: React.FunctionComponent<UnknownObject> = props => {
  const { masher } = useListeners({
    [EventType.Track]: masher => {
      setAudioTracks(masher.mash.audio.length)
      setVideoTracks(masher.mash.video.length)
    }
  })
  const [audioTracks, setAudioTracks] = React.useState(masher.mash.audio.length)
  const [videoTracks, setVideoTracks] = React.useState(masher.mash.video.length)

  const { children, ...rest } = props

  const childNodes = (): React.ReactElement[] => {
    const childNodes: React.ReactElement[] = []

    const kid = React.Children.only(children)
    if (!React.isValidElement(kid)) throw `Timeline.Tracks`

    for (let i = videoTracks - 1; i >= 0; i--) {
      const trackProps = {
        ...props,
        key: `video-track-${i}`,
        index: i,
        type: TrackType.Video,
        children: React.cloneElement(kid),
      }
      childNodes.push(<TimelineTrack {...trackProps} />)
    }

    for (let i = 0; i < audioTracks; i++) {
      const trackProps = {
        ...props,
        key: `audio-track-${i}`,
        index: i,
        type: TrackType.Audio,
        children: React.cloneElement(kid),
      }
      childNodes.push(<TimelineTrack {...trackProps} />)
    }
    return childNodes
  }

  const viewProps = { ...rest, children: childNodes() }
  return <View {...viewProps}/>
}

export { TimelineTracks }
