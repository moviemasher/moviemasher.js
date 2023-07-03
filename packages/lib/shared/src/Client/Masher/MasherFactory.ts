import type { Masher, MasherArgs, MasherOptions } from '@moviemasher/runtime-client'


import { TypesAsset } from '@moviemasher/runtime-shared'
import { TypeMasher } from '../../Plugin/PluginConstants.js'
import { Runtime } from '../../Runtime/Runtime.js'
import { Default } from '../../Setup/Default.js'
import { MasherClass } from './MasherClass.js'
import { MasherPlugin } from '../../Plugin/MasherPlugin.js'

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
TypesAsset.forEach(type => Runtime.plugins[TypeMasher][type] ||= plugin)
