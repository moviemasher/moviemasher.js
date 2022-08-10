import React from 'react'
import { 
  EmptyMethod, SelectedItems, SelectType, 
  StringSetter, DataGroup, TimeRange, Time
} from '@moviemasher/moviemasher.js'

export type DataGroupBooleans = {
  [index in DataGroup]?: boolean
} 

export interface SelectedInfo {
  tweenDefined: DataGroupBooleans
  tweenSelected: DataGroupBooleans
  selectedType: SelectType
  selectTypes: SelectType[]
  timeRange?: TimeRange
  onEdge?: boolean
  nearStart?: boolean
  time?: Time
}

export type TweenSetter = (group: DataGroup, tweening: boolean) => void
export interface InspectorContextInterface {
  actionCount: number
  selectedInfo: SelectedInfo
  selectedItems: SelectedItems
  changeSelected: StringSetter
  changeTweening: TweenSetter
}

export const InspectorContextDefault: InspectorContextInterface = {
  actionCount: 0,
  selectedInfo: {
    tweenDefined: {},
    tweenSelected: {},
    selectedType: SelectType.None,
    selectTypes: [],
  },
  selectedItems: [],
  changeSelected: EmptyMethod,
  changeTweening: EmptyMethod,
}

export const InspectorContext = React.createContext(InspectorContextDefault)
