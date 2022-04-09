import React from 'react'
import { DefinitionType, EventType, TrackType } from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'
import {
  InspectorContext, InspectorContextDefault, InspectorContextInterface
} from '../../Contexts/InspectorContext'
import { useMashEditor } from '../../Hooks/useMashEditor'

interface InspectorProps extends PropsAndChildren, WithClassName {}

/**
 * @parents Masher
 * @children InspectorContent
 */
function Inspector(props: InspectorProps): ReactResult {
  const masher = useMashEditor()
  useListeners({
    [EventType.Action]: () => {
      setActionCount(value => value + 1)
    },
    [EventType.Selection]: () => {
      setClip(masher.selection.clip)
      setEffect(masher.selection.effect)
      setTrack(masher.selection.track)
      setDefinitionType(masher.selection.clip ? masher.selection.clip.type : '')
      setTrackType(masher.selection.track ? masher.selection.track.trackType : '')
    },
  })

  const [definitionType, setDefinitionType] = React.useState<DefinitionType|''>('')
  const [trackType, setTrackType] = React.useState<TrackType|''>('')
  const [actionCount, setActionCount] = React.useState(() => 0)
  const [clip, setClip] = React.useState(() => masher.selection.clip)
  const [effect, setEffect] = React.useState(() => masher.selection.effect)
  const [track, setTrack] = React.useState(() => masher.selection.track)

  const inspectorContext: InspectorContextInterface = {
    ...InspectorContextDefault,
    actionCount, clip, effect, track, definitionType, trackType
  }

  return (
    <InspectorContext.Provider value={inspectorContext}>
      <View {...props}/>
    </InspectorContext.Provider>
  )
}

export { Inspector, InspectorProps }
