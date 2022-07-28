import React from 'react'
import { Clip, DefinitionType, Effect, EmptyMethod, SelectedProperties, SelectType, StringSetter, Track, TrackType } from '@moviemasher/moviemasher.js'


export interface InspectorContextInterface {
  definitionType: DefinitionType | ''
  actionCount: number
  selectedProperties: SelectedProperties
  selectTypes: SelectType[]
  selectedTypes: SelectType[]
  clip?: Clip
  effect?: Effect
  changeType: StringSetter
}

export const InspectorContextDefault: InspectorContextInterface = {
  definitionType: '',
  actionCount: 0,
  selectedProperties: [],
  selectTypes: [],
  selectedTypes: [],
  changeType: EmptyMethod
}

export const InspectorContext = React.createContext(InspectorContextDefault)
