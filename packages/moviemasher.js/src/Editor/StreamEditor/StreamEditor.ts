import { UnknownObject } from "../../declarations"
import { Stream } from "../../Edited/Stream/Stream"
import { Editor } from "../Editor"

interface StreamEditorObject extends UnknownObject {

}

interface StreamEditor extends Editor {
  stream: Stream
  streamUrl?: string
}

export { StreamEditor, StreamEditorObject }
