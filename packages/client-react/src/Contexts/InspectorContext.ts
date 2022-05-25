import React from 'react'
import { Clip, DefinitionType, Effect, SelectedProperties, Track, TrackType } from '@moviemasher/moviemasher.js'


export interface InspectorContextInterface {
  definitionType: DefinitionType | ''
  trackType: TrackType | ''
  actionCount: number
  selectedProperties: SelectedProperties
  clip?: Clip
  effect?: Effect
}

export const InspectorContextDefault: InspectorContextInterface = {
  definitionType: '',
  trackType: '',
  actionCount: 0,
  selectedProperties: [],
}

export const InspectorContext = React.createContext(InspectorContextDefault)
