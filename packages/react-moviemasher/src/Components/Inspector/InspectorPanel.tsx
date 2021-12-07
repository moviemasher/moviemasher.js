import React from 'react'
import { DefinitionType, EventType } from '@moviemasher/moviemasher.js'

import { Panel } from '../../declarations'
import { View } from '../../Utilities/View'
import { InspectorContext, InspectorContextInterface } from '../../Contexts/InspectorContext'
import { useListeners } from '../../Hooks/useListeners'

const InspectorPanel: Panel = props => {
  const { masher } = useListeners({
    [EventType.Action]: () => { setActionCount(nonce => nonce + 1) },
    [EventType.Selection]: masher => {
      console.log("InspectorPanel selection event", masher.selection)
      setClip(masher.selection.clip)
      setEffect(masher.selection.effect)
      setTrack(masher.selection.track)
      setDefinitionType(masher.selection.clip ? masher.selection.clip.type : '')
    },
  })

  const [definitionType, setDefinitionType] = React.useState<DefinitionType|''>('')

  const [actionCount, setActionCount] = React.useState(() => 0)
  const [clip, setClip] = React.useState(() => masher.selection.clip)
  const [effect, setEffect] = React.useState(() => masher.selection.effect)
  const [track, setTrack] = React.useState(() => masher.selection.track)

  const inspectorContext: InspectorContextInterface = {
    mash: masher.mash, actionCount, clip, effect, track, definitionType
  }

  return (
    <InspectorContext.Provider value={inspectorContext}>
      <View {...props}/>
    </InspectorContext.Provider>
  )
}

export { InspectorPanel }
