import { RenderingResult } from "../Api/Rendering"
import { Propertied } from "../Base/Propertied"
import { ValueObject, Value, UnknownObject, FilterGraphs, Endpoint } from "../declarations"
import { Mash } from "../Edited/Mash/Mash"
import { Preloader } from "../Preloader/Preloader"
import { OutputFormat, OutputType } from "../Setup/Enums"

export interface OutputObject extends UnknownObject {
  type?: OutputType
  format?: OutputFormat
  options?: ValueObject
}
export interface OutputArgs extends Required<OutputObject> { }
export interface Output extends OutputArgs, Propertied {
  filterGraphsPromise: (renderingResults?: RenderingResult[]) => Promise<FilterGraphs>
}

export interface DimensionalOutput {
  width?: number
  height?: number
}

export interface VisualOutput extends DimensionalOutput {
  cover?: boolean
}

export interface AudioOptions {
  audioBitrate?: Value
  audioChannels?: number
  audioCodec?: string
  audioRate?: number
}

export interface ImageOptions extends VisualOutput {
  offset?: number
}

export interface VideoOptions extends VisualOutput {
  videoBitrate?: Value
  videoCodec?: string
  videoRate?: number
  g?: number
}

export interface ImageOutputObject extends OutputObject, ImageOptions {}
export interface ImageOutput extends Output, Required<ImageOutputObject> {}

export interface AudioOutputObject extends OutputObject, AudioOptions {}
export interface AudioOutput extends Output, Required<AudioOutputObject> {}

export interface VideoOutputObject extends AudioOutputObject, VideoOptions { }
export interface VideoOutputArgs extends Required<VideoOutputObject> {}
export interface VideoOutput extends Output, VideoOutputArgs {}

export interface VideoSequenceOptions extends VisualOutput, AudioOptions {
  videoRate?: number
  quality?: number
}
export interface VideoSequenceOutputObject extends OutputObject, VideoSequenceOptions {}
export interface VideoSequenceOutput extends Output, Required<VideoSequenceOutputObject> { }


export interface VideoStreamOutputObject extends VideoOutputObject {}
export interface VideoStreamOutput extends VideoOutput {}

export interface WaveformOutputObject extends OutputObject, DimensionalOutput {
  backcolor?: string
  forecolor: string
}
export interface WaveformOutput extends Output, Required<WaveformOutputObject> { }

export interface OutputConstructorArgs {
  mash: Mash
  output: OutputObject
  cacheDirectory: string
  preloader: Preloader
}

export interface OutputOptions extends OutputObject, AudioOptions, VideoOptions { }
