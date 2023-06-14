import type { SelectorType } from "@moviemasher/runtime-client"
import type {Selectable} from '@moviemasher/runtime-client'
import type {SelectedProperties} from '@moviemasher/runtime-client'
import type {Masher} from '../Masher.js'
import type {Selector} from '../../../Helpers/Select/Select.js'

import { TypeClip, TypeContainer, TypeContent, TypeMash, TypeNone, TypeTrack } from "../../../Setup/EnumConstantsAndFunctions.js"
import { ClientInstance } from '../../../Client/ClientTypes.js'
import { ClientClip, ClientTrack, ClientMashAsset } from '../../../Client/Mash/ClientMashTypes.js'
import { EditorSelectionObject } from "@moviemasher/runtime-client"

export interface EditorSelection extends EditorSelectionObject {
  clear(): void
  editor: Masher
  focus: SelectorType
  get(selectType: SelectorType): Selectable | undefined
  object: EditorSelectionObject
  selectedItems(selectTypes?: SelectorType[]): SelectedProperties
  selectTypes: SelectorType[]
  selector: Selector
  set(selectable: Selectable): void
  unset(selectionType: SelectorType): void

  readonly [TypeNone]: Selectable | undefined
  readonly [TypeClip]: ClientClip | undefined
  readonly [TypeMash]: ClientMashAsset | undefined
  readonly [TypeTrack]: ClientTrack | undefined
  readonly [TypeContent]: ClientInstance | undefined
  readonly [TypeContainer]: ClientInstance | undefined
}