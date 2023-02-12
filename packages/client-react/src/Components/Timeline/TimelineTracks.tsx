import React from 'react'
import { EventType, arrayReversed, Tracks } from '@moviemasher/moviemasher.js'

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
  const [refresh, setRefreshed] = React.useState(() => 0)
  const updateRefreshed = () => { setRefreshed(nonce => nonce + 1) }
  const editor = useEditor()
  useListeners({
    [EventType.Loaded]: updateRefreshed, [EventType.Track]: updateRefreshed,
  })

  const { children } = props

  const childNodes = (): React.ReactElement[] => {
    const { mash } = editor.selection
    if (!mash) return []

    const { tracks } = mash
    const reversedTracks = arrayReversed(tracks) as Tracks
    return reversedTracks.map((track, i) => {
      const { identifier, index } = track
      const clones = React.Children.map(children, child => {
        if (!React.isValidElement(child)) throw `TimelineTracks`

        return React.cloneElement(child, { 
          key: `track-clone-${i}-${index}-${identifier}`
        })
      })
      const contextProps = {
        children: clones,
        value: { track },
        key: `track-context-${i}-${index}-${identifier}`
      }
      return <TrackContext.Provider {...contextProps} />
    })
  }

  const viewChildren = React.useMemo(childNodes, [refresh])
  
  const fragmentProps = {
    key: `track-content`,
    children: viewChildren,
  }
  return <React.Fragment { ...fragmentProps } />
}
