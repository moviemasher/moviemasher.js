import type { Value, ValueRecord } from '@moviemasher/runtime-shared'
import type { Size } from '@moviemasher/runtime-shared'


export interface OutputOptions {
  extension?: string
  format?: string
  options?: ValueRecord
}

export interface AudioOutputOptions extends OutputOptions {
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
}

export interface ImageOutputOptions extends Partial<Size>, OutputOptions {
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
}

export interface VideoOutputOptions extends ImageOutputOptions, AudioOutputOptions { }

export interface SequenceOutputOptions extends ImageOutputOptions {}

export interface FontOutputOptions extends OutputOptions {}

export interface WaveformOutputOptions extends OutputOptions {}