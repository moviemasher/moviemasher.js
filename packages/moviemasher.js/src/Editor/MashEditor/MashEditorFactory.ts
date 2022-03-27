import { Default } from "../../Setup/Default"
import { MashEditor, MashEditorObject } from "./MashEditor"
import { MashEditorClass } from "./MashEditorClass"

/**
 * @category Factory
 */
export const mashEditorInstance = (object: MashEditorObject = {}): MashEditor => {
  object.autoplay ||= Default.masher.autoplay
  object.precision ||= Default.masher.precision
  object.loop ||= Default.masher.loop
  object.fps ||= Default.masher.fps
  object.volume ||= Default.masher.volume
  object.buffer ||= Default.masher.buffer
  const instance = new MashEditorClass(object)
  return instance
}
