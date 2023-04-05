import type { Output} from '../../Base/Code.js'
import type {Plugin, TranscodeType} from '../Plugin.js'
import type {RenderingCommandOutput} from '../Encode/Encode.js'
import type {TranscodingType} from './Transcoding/Transcoding.js'

import {isOutput} from '../../Base/Code.js'
import {isTyped} from '../../Base/Typed.js'

export interface TranscodeOutput extends Output {
  options: RenderingCommandOutput
  type: TranscodingType
  
}
export const isTranscodeOutput = (value: any): value is TranscodeOutput => {
  return isOutput(value) && isTyped(value)
}

export interface TranscoderOptions extends Output {}

export interface FontTranscoderOptions extends TranscoderOptions {}

export interface TranscodePlugin extends Plugin {
  type: TranscodeType
}