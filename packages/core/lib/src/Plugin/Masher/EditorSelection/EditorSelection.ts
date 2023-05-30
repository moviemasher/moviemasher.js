import type {SelectorType} from '../../../Setup/Enums.js'
import type {Track} from '../../../Shared/Mash/Track/Track.js'
import type {Selectable} from '../Selectable.js'
import type {SelectedItems} from '../../../Helpers/Select/SelectedProperty.js'
import type {Masher} from '../Masher.js'
import type {ClientEffect} from '../../../Effect/Effect.js'
import type {Selector} from '../../../Helpers/Select/Select.js'

import { TypeClip, TypeContainer, TypeContent, TypeEffect, TypeMash, TypeNone, TypeTrack } from "../../../Setup/EnumConstantsAndFunctions.js"
import { ClientInstance } from '../../../Client/ClientTypes.js'
import { ClientClip, ClientTrack, MashClientAsset } from '../../../Client/Mash/MashClientTypes.js'

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

  readonly [TypeNone]: Selectable | undefined
  readonly [TypeClip]: ClientClip | undefined
  readonly [TypeMash]: MashClientAsset | undefined
  readonly [TypeEffect]: ClientEffect | undefined
  readonly [TypeTrack]: ClientTrack | undefined
  readonly [TypeContent]: ClientInstance | undefined
  readonly [TypeContainer]: ClientInstance | undefined
}