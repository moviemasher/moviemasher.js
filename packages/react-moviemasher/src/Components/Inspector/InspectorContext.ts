import React from 'react'
import { Clip, DefinitionType, Effect, Mash } from '@moviemasher/moviemasher.js'

import { EditorContextDefault } from '../Editor/EditorContext'

interface InspectorContextInterface {
  definitionType: DefinitionType
  actionCount: number
  clip?: Clip
  effect?: Effect
  mash: Mash
}
const InspectorContextDefault: InspectorContextInterface = {
  definitionType: DefinitionType.Mash,
  actionCount: 0,
  mash: EditorContextDefault.masher.mash,
}

const InspectorContext = React.createContext(InspectorContextDefault)

export { InspectorContext, InspectorContextInterface, InspectorContextDefault }
