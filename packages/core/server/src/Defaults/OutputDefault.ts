import { 
  VideoEncoderOptions, NumberRecord, OutputFormat, EncodingType, 
  RenderingCommandOutput, AudioType, ImageType, FontType, VideoType, errorThrow, ErrorName 
} from "@moviemasher/moviemasher.js"


import outputDefaultAudioJson from './audio.json'
import outputDefaultFontJson from './font.json'
import outputDefaultImagePngJson from './imagepng.json'
import outputDefaultVideoJson from './video.json'
import outputDefaultSequenceJson from './imagesequence.json'
import outputDefaultWaveformJson from './waveform.json'
import outputDefaultImageJson from './image.json'

export const outputDefaultAudio = (overrides?: VideoEncoderOptions): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultAudioJson as RenderingCommandOutput
  return { ...commandOutput,  ...object }
}

export const outputDefaultFont = (overrides?: VideoEncoderOptions): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultFontJson as RenderingCommandOutput
  return { ...commandOutput,  ...object }
}


export const outputDefaultVideo = (overrides?: VideoEncoderOptions): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultVideoJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}
export const outputDefaultSequence = (overrides?: VideoEncoderOptions): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultSequenceJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}
export const outputDefaultWaveform = (overrides?: VideoEncoderOptions): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultWaveformJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}

export const outputDefaultPng = (overrides?: VideoEncoderOptions): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultImagePngJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}
export const outputDefaultImage = (overrides?: VideoEncoderOptions): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultImageJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}

export const outputDefaultPopulate = (overrides: RenderingCommandOutput): RenderingCommandOutput => {
  const { outputType } = overrides
  switch (outputType) {
    case AudioType: return outputDefaultAudio(overrides)
    case ImageType: return outputDefaultImage(overrides)
    case VideoType: return outputDefaultVideo(overrides)
    // case FontType: return outputDefaultFont(overrides)
    // case SequenceType: return outputDefaultSequence(overrides)
  }
  errorThrow(ErrorName.Type)
}

export const outputDefaultRendering = (outputType: EncodingType, overrides?: VideoEncoderOptions): RenderingCommandOutput => {
  return outputDefaultPopulate({ ...overrides, outputType })
}


export const renderingCommandOutput = (output: RenderingCommandOutput): RenderingCommandOutput => {
  const counts: NumberRecord = {}
    const { outputType } = output
    const populated = outputDefaultPopulate(output)
    if (!counts[outputType]) {
      counts[outputType] = 1
    } else {
      populated.basename ||= `${outputType}-${counts[outputType]}`
      counts[outputType]++
    }
    return populated

}


export const outputDefaultTypeByFormat = {
  [OutputFormat.AudioConcat]: AudioType,
  [OutputFormat.Mdash]: VideoType,
  [OutputFormat.Flv]: VideoType,
  [OutputFormat.Hls]: VideoType,
  [OutputFormat.Jpeg]: ImageType,
  [OutputFormat.Mp3]: AudioType,
  [OutputFormat.Mp4]: VideoType,
  [OutputFormat.Png]: ImageType,
  [OutputFormat.Rtmp]: VideoType,
  [OutputFormat.VideoConcat]: VideoType,
}

export const outputDefaultFormatByType = {
  [AudioType]: OutputFormat.Mp3,
  [ImageType]: OutputFormat.Png,
  [VideoType]: OutputFormat.Mp4,
  // [ImageTypeSequence]: OutputFormat.Jpeg,
}


