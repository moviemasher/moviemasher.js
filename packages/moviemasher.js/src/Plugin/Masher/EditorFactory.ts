import { Default } from "../../Setup/Default"
import { MasherClass } from "./MasherClass"
import { Masher, MasherArgs, MasherOptions, MashingTypes, MasherPlugin } from "./Masher"
import { Runtime } from "../../Runtime"
import { MasherType } from "../Plugin"
import { AudioType } from "../../Setup/Enums"
export let editorSingleton: Masher
export const editorArgs = (options: MasherOptions = {}): MasherArgs => {
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
const masher = (options: MasherOptions = {}): Masher => {
  return new MasherClass(editorArgs(options))
}
const plugin: MasherPlugin = { type: MasherType, masher }
MashingTypes.forEach(type => Runtime.plugins[MasherType][type] ||= plugin)
