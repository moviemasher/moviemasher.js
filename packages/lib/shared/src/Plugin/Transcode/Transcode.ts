import type { Output } from "../../Base/Output.js"
import type { Plugin, TranscodeType } from '@moviemasher/runtime-shared'
import type { OutputOptions } from "../../Helpers/Output/Output.js"
import type { TranscodingType } from './Transcoding/Transcoding.js'
import type { StringDataOrError } from '../../Helpers/ClientMedia/ClientMedia.js'


export interface TranscodeOutput extends Output {
  options: OutputOptions
  type: TranscodingType
}


export interface TranscoderOptions extends Output {}

export interface FontTranscoderOptions extends TranscoderOptions {}

export interface TranscodePlugin extends Plugin {
  type: TranscodeType
  transcodingType: TranscodingType
  transcode: TranscodeMethod
}
export type TranscodeMethod = (localPath: string, options: OutputOptions) => Promise<StringDataOrError>
