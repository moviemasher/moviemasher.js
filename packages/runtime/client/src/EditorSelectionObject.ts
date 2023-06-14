import type { SelectorType } from './SelectorType.js'
import type { Selectable } from './Selectable.js'


export type EditorSelectionObject = {
  [index in SelectorType]?: Selectable
}
