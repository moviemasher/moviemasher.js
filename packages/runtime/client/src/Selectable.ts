import type { Actions } from './Actions.js'
import type { SelectedProperties } from './SelectedProperty.js'
import type { SelectorType } from './SelectorType.js'

export interface Selectable { 
  selectables(): Selectables
  selectedItems(actions: Actions): SelectedProperties 
  selectType: SelectorType
}

export type Selectables = Selectable[]

export type SelectableRecord = {
  [index in SelectorType]?: Selectable
}

export interface SelectorTypesObject extends Record<string, SelectorType[]> {}
