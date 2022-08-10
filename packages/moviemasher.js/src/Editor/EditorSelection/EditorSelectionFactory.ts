import { EditorSelection } from "./EditorSelection"
import { EditorSelectionClass } from "./EditorSelectionClass"

export const editorSelectionInstance = (): EditorSelection => {
  return new EditorSelectionClass()
}