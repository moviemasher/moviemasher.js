import { DataCastGetResponse } from "../../Api/Data"
import { Cast } from "../../Edited/Cast/Cast"
import { Editor, EditorOptions } from "../Editor"

export interface CastEditorOptions extends EditorOptions {}

export interface CastEditor extends Editor {
  cast: Cast
  edited: Cast
  loadData(data: DataCastGetResponse): void
  streamUrl?: string
  streaming: boolean
  editingMash: boolean
}
