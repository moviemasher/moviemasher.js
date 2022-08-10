import { SelectType } from "../Setup/Enums"
import { Actions } from "./Actions/Actions"
import { SelectedItems } from "../Utility/SelectedProperty"

export interface Selectable { // = Cast | Mash | Track | Layer | Clip 

  selectType: SelectType
  selectables(): Selectables
  selectedItems(actions: Actions): SelectedItems 

}
export type Selectables = Selectable[]

export type SelectableRecord = {
  [index in SelectType]?: Selectable
}
export interface SelectTypesObject extends Record<string, SelectType[]> {}
