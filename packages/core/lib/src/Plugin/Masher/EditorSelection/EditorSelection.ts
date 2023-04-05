import type {SelectorType} from '../../../Setup/Enums.js'
import type {MashMedia} from '../../../Media/Mash/Mash.js'
import type {Track} from '../../../Media/Mash/Track/Track.js'
import type {Clip} from '../../../Media/Mash/Track/Clip/Clip.js'
import type {Selectable} from '../Selectable.js'
import type {SelectedItems} from '../../../Helpers/Select/SelectedProperty.js'
import type {Container} from '../../../Media/Container/Container.js'
import type {Content} from '../../../Media/Content/Content.js'
import type {Masher} from '../Masher.js'
import type {Effect} from '../../../Media/Effect/Effect.js'
import type {Selector} from '../../../Helpers/Select/Select.js'

import {
  TypeClip, TypeContainer, TypeContent, TypeEffect, TypeMash, TypeNone, TypeTrack
} from '../../../Setup/Enums.js'

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
  readonly [TypeClip]: Clip | undefined
  readonly [TypeMash]: MashMedia | undefined
  readonly [TypeEffect]: Effect | undefined
  readonly [TypeTrack]: Track | undefined
  readonly [TypeContent]: Content | undefined
  readonly [TypeContainer]: Container | undefined
}