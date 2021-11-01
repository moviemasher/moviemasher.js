import React from 'react'
import { TrackType, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../Utilities/View'
import { TimelineTrack } from './TimelineTrack'

import { EditorContext } from '../Editor/EditorContext'
import { useMashScale } from './useMashScale'

const TimelineTracks: React.FC<UnknownObject> = props => {
  // console.log("TimelineTracks")
  const appContext = React.useContext(EditorContext)
  const scale = useMashScale()

  const { children, ...rest } = props

  const { audioTracks, videoTracks} = appContext

  const childNodes = (): React.ReactElement[] => {
    // console.log("TimelineTracks.childNodes")
    const childNodes: React.ReactElement[] = []
    if (!scale) return childNodes

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

  const viewProps : UnknownObject = {
    ...rest,
    children: childNodes(),
  }

  return <View {...viewProps}/>
}

export { TimelineTracks }
