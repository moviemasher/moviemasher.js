import { ClipType, ContainerType, ContentType, EffectType, MashType, NoneType, SelectorType, TrackType } from "../../../Setup/Enums"
import { MashMedia } from "../../../Media/Mash/Mash"
import { Track } from "../../../Media/Mash/Track/Track"
import { Clip } from "../../../Media/Mash/Track/Clip/Clip"
import { Selectable } from "../Selectable"
import { SelectedItems } from "../../../Helpers/Select/SelectedProperty"
import { Container } from "../../../Media/Container"
import { Content } from "../../../Media/Content/Content"
import { Masher } from "../Masher"
import { Effect } from "../../../Media/Effect/Effect"
import { Selector } from "../../../Helpers/Select/Select"


export type EditorSelectionObject = {
  [index in SelectorType]?: Selectable
} 

export interface EditorSelection extends EditorSelectionObject {
  clear(): void
  editor: Masher
  focus: SelectorType
  get(selectType: SelectorType): Selectable | undefined
  object: EditorSelectionObject
  selectedItems(selectTypes?: SelectorType[]): SelectedItems
  selectTypes: SelectorType[]
  selector: Selector
  set(selectable: Selectable): void
  unset(selectionType: SelectorType): void

  readonly [NoneType]: Selectable | undefined
  readonly [ClipType]: Clip | undefined
  readonly [MashType]: MashMedia | undefined
  readonly [EffectType]: Effect | undefined
  readonly [TrackType]: Track | undefined
  readonly [ContentType]: Content | undefined
  readonly [ContainerType]: Container | undefined
}