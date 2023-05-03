import {Default} from '../../Setup/Default.js'
import {MasherClass} from './MasherClass.js'
import {Masher, MasherArgs, MasherOptions, MashingTypes, MasherPlugin} from './Masher.js'
import {Runtime} from '../../Runtime/Runtime.js'
import {TypeMasher} from '../Plugin.js'
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

export const masherInstance = (options: MasherOptions = {}): Masher => {
  return new MasherClass(editorArgs(options))
}
const plugin: MasherPlugin = { type: TypeMasher, masher: masherInstance }
MashingTypes.forEach(type => Runtime.plugins[TypeMasher][type] ||= plugin)
