import { SelectType } from "../../Setup/Enums"
import { MashMedia } from "../../Media/Mash/Mash"
import { Track } from "../../Media/Mash/Track/Track"
import { Clip } from "../../Media/Mash/Track/Clip/Clip"
import { Selectable } from "../Selectable"
import { SelectedItems } from "../../Helpers/Select/SelectedProperty"
import { Container } from "../../Media/Container"
import { Content } from "../../Media/Content/Content"
import { Editor } from "../Editor"


export type EditorSelectionObject = {
  [index in SelectType]?: Selectable
} 

export interface EditorSelection extends EditorSelectionObject {
  clear(): void
  editor: Editor
  focus: SelectType
  get(selectType: SelectType): Selectable | undefined
  object: EditorSelectionObject
  selectedItems(selectTypes?: SelectType[]): SelectedItems
  selectTypes: SelectType[]
  set(selectable: Selectable): void
  unset(selectionType: SelectType): void

  [SelectType.Clip]: Clip | undefined
  [SelectType.Mash]: MashMedia | undefined
  [SelectType.Track]: Track | undefined
  [SelectType.Content]: Content | undefined
  [SelectType.Container]: Container | undefined
}