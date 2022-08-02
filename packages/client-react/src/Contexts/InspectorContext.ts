import React from 'react'
import { Clip, SelectTypesObject, DefinitionType, Effect, EmptyMethod, SelectedItems, SelectType, StringSetter, Track, TrackType, BooleanSetter } from '@moviemasher/moviemasher.js'


export interface InspectorContextInterface {
  definitionType: DefinitionType | ''
  actionCount: number
  selectedItems: SelectedItems
  selectTypes: SelectType[]
  selectedTypes: SelectType[]
  clip?: Clip
  effect?: Effect
  selected: string
  changeSelected: StringSetter
  selectTypesObject: SelectTypesObject
  tweening: boolean
  changeTweening: BooleanSetter
}

export const InspectorContextDefault: InspectorContextInterface = {
  definitionType: '',
  actionCount: 0,
  selectedItems: [],
  selectTypes: [],
  selectedTypes: [],
  changeSelected: EmptyMethod,
  selected: '',
  selectTypesObject: {},
  tweening: false,
  changeTweening: EmptyMethod,
}

export const InspectorContext = React.createContext(InspectorContextDefault)
