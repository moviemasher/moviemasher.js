import type { Output } from '@moviemasher/lib-shared'
import type { OutputOptions, TranscodingType } from '@moviemasher/runtime-shared'

export interface TranscodeOutput extends Output {
  options: OutputOptions
  type: TranscodingType
}

export interface TranscoderOptions extends Output {}

export interface FontTranscoderOptions extends TranscoderOptions {}
