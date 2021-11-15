import React from 'react'
import { DefinitionType, EventType } from '@moviemasher/moviemasher.js'

import { Panel } from '../../declarations'
import { View } from '../../Utilities/View'
import { InspectorContext, InspectorContextInterface } from './InspectorContext'
import { useListeners } from '../../Hooks/useListeners'

const InspectorPanel: Panel = props => {
  const { masher } = useListeners({
    [EventType.Action]: () => { setActionCount(nonce => nonce + 1) },
    [EventType.Selection]: masher => {
      setClip(masher.clip)
      setEffect(masher.effect)
      setDefinitionType(masher.selected.type)
    },
  })

  const [definitionType, setDefinitionType] = React.useState(DefinitionType.Mash)

  const [actionCount, setActionCount] = React.useState(0)
  const [clip, setClip] = React.useState(masher.clip)
  const [effect, setEffect] = React.useState(masher.effect)

  const inspectorContext: InspectorContextInterface = {
    mash: masher.mash, actionCount, clip, effect, definitionType
  }

  return (
    <InspectorContext.Provider value={inspectorContext}>
      <View {...props}/>
    </InspectorContext.Provider>
  )
}

export { InspectorPanel }
