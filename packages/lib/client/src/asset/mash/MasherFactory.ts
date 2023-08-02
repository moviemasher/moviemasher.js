import type { Masher, MasherArgs, MasherOptions } from '@moviemasher/runtime-client'

import { Default } from '@moviemasher/lib-shared'
import { MasherClass } from './MasherClass'

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
