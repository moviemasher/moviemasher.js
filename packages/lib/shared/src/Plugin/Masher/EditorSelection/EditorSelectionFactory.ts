import {EditorSelection} from './EditorSelection.js'
import {EditorSelectionClass} from './EditorSelectionClass.js'

export const editorSelectionInstance = (): EditorSelection => {
  return new EditorSelectionClass()
}