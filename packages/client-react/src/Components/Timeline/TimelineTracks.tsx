import React from 'react'
import { EventType, TrackType, Track } from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult } from '../../declarations'
import { useListeners } from '../../Hooks/useListeners'
import { TrackContext } from '../../Contexts/TrackContext'
import { useEditor } from '../../Hooks/useEditor'

export interface TimelineTracksProps extends PropsAndChildren {}

/**
 * @parents TimelineContent
 * @children TimelineTrack
 */
export function TimelineTracks(props: TimelineTracksProps): ReactResult {
  const { children } = props
  const [refresh, setRefreshed] = React.useState(() => 0)
  const updateRefreshed = () => { setRefreshed(nonce => nonce + 1) }
  const editor = useEditor()
  useListeners({
    [EventType.Mash]: updateRefreshed, [EventType.Track]: updateRefreshed,
  })

  const childNode = (trackIndex: number, trackType: TrackType): React.ReactElement => {
    const { mash } = editor.selection
    const track: Track = mash!.trackOfTypeAtIndex(trackType, trackIndex)
    const { identifier } = track
    const trackContext = { track }
    const contextProps = {
      children,
      value: trackContext,
      key: `track-context-${identifier}`
    }
    return <TrackContext.Provider {...contextProps} />
  }

  const childNodes = (): React.ReactElement[] => {
    const { mash } = editor.selection
    const audioTracks = mash?.trackCount(TrackType.Audio) || 0
    const videoTracks = mash?.trackCount(TrackType.Video) || 0
    const childNodes: React.ReactElement[] = []
    for (let i = videoTracks - 1; i >= 0; i--) childNodes.push(childNode(i, TrackType.Video))
    for (let i = 0; i < audioTracks; i++) childNodes.push(childNode(i, TrackType.Audio))
    return childNodes
  }

  const viewChildren = React.useMemo(childNodes, [refresh])
  return <>{viewChildren}</>

}
