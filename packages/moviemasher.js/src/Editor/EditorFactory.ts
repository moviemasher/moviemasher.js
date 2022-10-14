import { Default } from "../Setup/Default"
import { EditorClass } from "./EditorClass"
import { Editor, EditorArgs, EditorOptions } from "./Editor"
export let editorSingleton: Editor
export const editorArgs = (options: EditorOptions = {}): EditorArgs => {
  return {
    autoplay: Default.editor.autoplay,
    precision: Default.editor.precision,
    loop: Default.editor.loop,
    fps: Default.editor.fps,
    volume: Default.editor.volume,
    buffer: Default.editor.buffer,
    ...options
  }
}
export const editorInstance = (options: EditorOptions = {}): Editor => {
  return editorSingleton = new EditorClass(editorArgs(options))
}
