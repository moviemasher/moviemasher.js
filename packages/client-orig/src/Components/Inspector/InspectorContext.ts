import { 
  EmptyFunction, SelectedItems, 
  DataGroup, TimeRange, Time, NoneType
} from '@moviemasher/lib-core'

import type { SelectorType, StringSetter, SelectorTypes } from '@moviemasher/lib-core'
import { createContext } from '../../Framework/FrameworkFunctions'

export type DataGroupBooleans = {
  [index in DataGroup]?: boolean
} 

export interface SelectedInfo {
  tweenDefined: DataGroupBooleans
  tweenSelected: DataGroupBooleans
  selectedType: SelectorType
  selectTypes: SelectorTypes
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
    selectedType: NoneType,
    selectTypes: [],
  },
  selectedItems: [],
  changeSelected: EmptyFunction,
  changeTweening: EmptyFunction,
}

export const InspectorContext = createContext(InspectorContextDefault)
