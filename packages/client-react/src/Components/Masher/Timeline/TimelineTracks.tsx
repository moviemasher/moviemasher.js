import React from 'react'
import { EventType, TrackType } from '@moviemasher/moviemasher.js'

import { View } from '../../../Utilities/View'
import { TimelineTrack } from './TimelineTrack'
import { useListeners } from '../../../Hooks/useListeners'
import { PropsWithChildren, ReactResult } from '../../../declarations'
import { useMashEditor } from '../../../Hooks/useMashEditor'

interface TimelineTracksProps extends PropsWithChildren {
  className?: string
}

/**
 * @parents TimelineContent
 */
function TimelineTracks(props: TimelineTracksProps): ReactResult {
  const masher = useMashEditor()
  useListeners({
    [EventType.Track]: () => {
      setAudioTracks(masher.mash.trackCount(TrackType.Audio))
      setVideoTracks(masher.mash.trackCount(TrackType.Video))
      setTransitionTracks(masher.mash.trackCount(TrackType.Transition))
    },
    [EventType.Action]: () => { setActionCount(nonce => nonce + 1) },
  })
  const [_, setActionCount] = React.useState(() => 0)
  const [audioTracks, setAudioTracks] = React.useState(masher.mash.trackCount(TrackType.Audio))
  const [videoTracks, setVideoTracks] = React.useState(masher.mash.trackCount(TrackType.Video))
  const [transitionTracks, setTransitionTracks] = React.useState(masher.mash.trackCount(TrackType.Transition))

  const { children, ...rest } = props
  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `Timeline.Tracks`

  const childNode = (layer: number, trackType: TrackType): React.ReactElement => {
    const trackProps = {
      ...props,
      key: `${trackType}-track-${layer}`,
      layer,
      trackType,
      children: React.cloneElement(kid),
    }
    return <TimelineTrack {...trackProps} />
  }

  const childNodes = (): React.ReactElement[] => {
    const childNodes: React.ReactElement[] = []
    const highestTrack = Math.max(videoTracks, transitionTracks)
    for (let i = highestTrack - 1; i >= 0; i--) {
      if (i < transitionTracks) childNodes.push(childNode(i, TrackType.Transition))
      if (i < videoTracks) childNodes.push(childNode(i, TrackType.Video))
    }
    for (let i = 0; i < audioTracks; i++) childNodes.push(childNode(i, TrackType.Audio))
    return childNodes
  }

  const onClick: React.MouseEventHandler = () => { masher.selectTrack(undefined) }

  const viewProps = { ...rest, children: childNodes(), onClick }
  return <View {...viewProps}/>
}

export { TimelineTracks, TimelineTracksProps }
