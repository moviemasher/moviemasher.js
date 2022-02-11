import { Cast } from "../../Edited/Cast/Cast"
import { Editor, EditorOptions } from "../Editor"

interface CastEditorOptions extends EditorOptions {

}

interface CastEditor extends Editor {
  cast: Cast
  streamUrl?: string
  streaming: boolean
  editingMash: boolean
}

export { CastEditor, CastEditorOptions }
