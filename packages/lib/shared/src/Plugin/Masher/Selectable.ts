import type { SelectorType } from '../../Setup/Enums.js'
import type { SelectedItems } from '../../Helpers/Select/SelectedProperty.js'
import {Actions} from './Actions/Actions.js'

export interface Selectable { 
  selectables(): Selectables
  selectedItems(actions: Actions): SelectedItems 
  selectType: SelectorType
}

export type Selectables = Selectable[]

export type SelectableRecord = {
  [index in SelectorType]?: Selectable
}

export interface SelectorTypesObject extends Record<string, SelectorType[]> {}
