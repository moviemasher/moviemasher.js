import type { Actions } from './Actions.js'
import type { SelectedProperties } from './SelectedProperty.js'
import type { Propertied, PropertyIds, SelectorType, Strings, TargetId, TargetIds } from '@moviemasher/runtime-shared'

export interface Selectable extends Propertied { 
  targetId: TargetId
  selectables(): Selectables
  selectedProperties(actions: Actions, propertyNames: Strings): SelectedProperties
  
}

export type Selectables = Selectable[]

export interface SelectorTypesObject extends Record<string, SelectorType[]> {}
