import { SelectType } from "../../Setup/Enums"
import { Mash } from "../../Edited/Mash/Mash"
import { Cast } from "../../Edited/Cast/Cast"
import { Track } from "../../Edited/Mash/Track/Track"
import { Layer } from "../../Edited/Cast/Layer/Layer"
import { Clip } from "../../Edited/Mash/Track/Clip/Clip"
import { Selectable, SelectableRecord } from "../Selectable"
import { SelectedItems } from "../../Utility/SelectedProperty"
import { Container } from "../../Media/Container"
import { Content } from "../../Media/Content/Content"
import { Editor } from "../Editor"
import { Effect } from "../../Module/Effect/Effect"


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

  [SelectType.Cast]: Cast | undefined
  [SelectType.Clip]: Clip | undefined
  [SelectType.Layer]: Layer | undefined
  [SelectType.Mash]: Mash | undefined
  [SelectType.Track]: Track | undefined
  [SelectType.Content]: Content | undefined
  [SelectType.Container]: Container | undefined
}