import React from 'react'
import { arrayReversed, Tracks, EventTypeLoaded, EventTypeTrack } from '@moviemasher/lib-core'

import { JsxElements } from "../../Types/Element"
import { PropsWithChildren } from "../../Types/Props"
import { useListeners } from '../../Hooks/useListeners'
import { TrackContext } from '../../Contexts/TrackContext'
import { useMasher } from '../../Hooks/useMasher'

export interface TimelineTracksProps extends PropsWithChildren {}


export function TimelineTracks(props: TimelineTracksProps) {
  const [refresh, setRefreshed] = React.useState(() => 0)
  const updateRefreshed = () => { setRefreshed(nonce => nonce + 1) }
  const editor = useMasher()
  useListeners({
    [EventTypeLoaded]: updateRefreshed, [EventTypeTrack]: updateRefreshed,
  })

  const { children } = props

  const childNodes = (): JsxElements => {
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
