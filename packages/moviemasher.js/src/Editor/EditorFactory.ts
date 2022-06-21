import { Default } from "../Setup/Default"
import { EditorClass } from "./EditorClass"
import { Editor, EditorArgs, EditorOptions } from "./Editor"
export let editorSingleton: Editor
export const editorArgs = (options: EditorOptions = {}): EditorArgs => {
  return {
    autoplay: Default.masher.autoplay,
    precision: Default.masher.precision,
    loop: Default.masher.loop,
    fps: Default.masher.fps,
    volume: Default.masher.volume,
    buffer: Default.masher.buffer,
    ...options
  }
}
export const editorInstance = (options: EditorOptions = {}): Editor => {
  return editorSingleton = new EditorClass(editorArgs(options))
}
