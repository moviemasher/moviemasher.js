import { Propertied } from "../Base/Propertied"
import { ValueObject, Value } from "../declarations"
import { OutputType } from "../Setup/Enums"

interface BaseOutput {
  type: OutputType
  options?: ValueObject
  extension?: string
  name?: string
  prefix?: string
}

interface AVBaseOutput extends BaseOutput {
  precision?: number
}

interface VBaseOutput extends BaseOutput {
  width?: number
  height?: number
}

interface AudioOptions {
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
}
interface AudioOutput extends AVBaseOutput, AudioOptions {
  type: OutputType.Audio
}

// ffmpeg -i input.mp3 -af "afade=enable='between(t,0,3)':t=in:ss=0:d=3,afade=enable='between(t,7,10)':t=out:st=7:d=3,afade=enable='between(t,10,13)':t=in:st=10:d=3,afade=enable='between(t,13,16)':t=out:st=13:d=3" -t 16 output.mp3


interface ImageOutput extends VBaseOutput {
  type: OutputType.Image
  offset?: number
}

interface WaveformOutput extends AVBaseOutput {
  type: OutputType.Waveform
  backcolor?: string
  forecolor: string
}

interface SequenceOutput extends VBaseOutput {
  type: OutputType.VideoSequence
  videoRate?: number
  quality?: number
  audioOutput?: AudioOutput
}

interface VideoOptions {
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
  width?: number
  height?: number
  g?: number
}


interface VideoOutput extends AVBaseOutput, VideoOptions {
  type: OutputType.Video
  audioOutput?: AudioOutput
}


interface OutputOptions extends AudioOptions, VideoOptions {
  // type: OutputType.VideoStream
  format?: string
  options?: ValueObject,
}

// interface OutputOptions extends Partial<OutputObject> {}
interface OutputObject extends Required<OutputOptions> {}

interface Output extends OutputObject, Propertied {}

export {
  VideoOutput,
  AudioOutput,
  ImageOutput,
  WaveformOutput,
  SequenceOutput,
  OutputOptions, Output, OutputObject
}
