import React from 'react'
import { Clip, DefinitionType, Effect, SelectedProperties, Track, TrackType } from '@moviemasher/moviemasher.js'


interface InspectorContextInterface {
  definitionType: DefinitionType | ''
  trackType: TrackType | ''
  actionCount: number
  selectedProperties: SelectedProperties
  clip?: Clip
  effect?: Effect
  track?: Track
}
const InspectorContextDefault: InspectorContextInterface = {
  definitionType: '',
  trackType: '',
  actionCount: 0,
  selectedProperties: [],
}

const InspectorContext = React.createContext(InspectorContextDefault)

export { InspectorContext, InspectorContextInterface, InspectorContextDefault }
