import React from 'react'
import { DefinitionType } from '@moviemasher/moviemasher.js'

interface InspectorContextInterface {
  definitionType: DefinitionType
}
const InspectorContextDefault: InspectorContextInterface = {
  definitionType: DefinitionType.Mash
}

const InspectorContext = React.createContext(InspectorContextDefault)

export { InspectorContext, InspectorContextInterface, InspectorContextDefault }
