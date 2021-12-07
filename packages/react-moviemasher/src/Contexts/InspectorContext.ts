import React from 'react'
import { Clip, DefinitionType, Effect, Mash, Track } from '@moviemasher/moviemasher.js'

import { EditorContextDefault } from './EditorContext'

interface InspectorContextInterface {
  definitionType: DefinitionType | ''
  actionCount: number
  clip?: Clip
  effect?: Effect
  track?: Track
  mash: Mash
}
const InspectorContextDefault: InspectorContextInterface = {
  definitionType: '',
  actionCount: 0,
  mash: EditorContextDefault.masher.mash,
}

const InspectorContext = React.createContext(InspectorContextDefault)

export { InspectorContext, InspectorContextInterface, InspectorContextDefault }
