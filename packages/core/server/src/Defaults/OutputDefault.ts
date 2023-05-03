import type { 
  VideoEncoderOptions, NumberRecord, EncodingType, 
  RenderingCommandOutput,
} from "@moviemasher/lib-core"

import { 
  OutputFormatAudioConcat,
  OutputFormatFlv,
  OutputFormatHls,
  OutputFormatJpeg,
  OutputFormatMdash,
  OutputFormatMp3,
  OutputFormatMp4,
  OutputFormatPng,
  OutputFormatRtmp,
  OutputFormatVideoConcat, 
  TypeAudio, TypeImage, TypeVideo, errorThrow, ErrorName 
} from "@moviemasher/lib-core"

const outputDefaultAudioJson = {
  "options": {},
  "audioBitrate": 160,
  "audioCodec": "libmp3lame",
  "audioChannels": 2,
  "audioRate": 44100,
  "extension": "mp3",
  "outputType": "audio"
}

const outputDefaultFontJson = {
  "options": {},
  "extension": "woff2",
  "outputType": "font"
}

const outputDefaultImagePngJson = {
  "options": {},
  "width": 320,
  "height": 240,
  "extension": "png",
  "outputType": "image",
  "format": "image2",
  "offset": 0
}

const outputDefaultVideoJson = {
  "options": {
    "g": 60,
    "level": 41,
    "movflags": "faststart"
  },
  "width": 1920,
  "height": 1080,
  "videoRate": 30,
  "videoBitrate": 2000,
  "audioBitrate": 160,
  "audioCodec": "aac",
  "videoCodec": "libx264",
  "audioChannels": 2,
  "audioRate": 44100,
  "g": 0,
  "format": "mp4",
  "extension": "mp4",
  "outputType": "video"
}

const outputDefaultSequenceJson = {
  "options": {},
  "format": "image2",
  "width": 320,
  "height": 240,
  "videoRate": 10,
  "extension": "jpg",
  "outputType": "imagesequence"
}

const outputDefaultWaveformJson = {
  "options": {},
  "width": 320,
  "height": 240,
  "forecolor": "#000000",
  "backcolor": "#00000000",
  "audioBitrate": 160,
  "audioCodec": "aac",
  "audioChannels": 2,
  "audioRate": 44100,
  "extension": "png",
  "outputType": "waveform"
}

const outputDefaultImageJson = {
  "options": {},
  "width": 320,
  "height": 240,
  "extension": "jpg",
  "outputType": "image",
  "offset": 0
}


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
    case TypeAudio: return outputDefaultAudio(overrides)
    case TypeImage: return outputDefaultImage(overrides)
    case TypeVideo: return outputDefaultVideo(overrides)
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
  [OutputFormatAudioConcat]: TypeAudio,
  [OutputFormatMdash]: TypeVideo,
  [OutputFormatFlv]: TypeVideo,
  [OutputFormatHls]: TypeVideo,
  [OutputFormatJpeg]: TypeImage,
  [OutputFormatMp3]: TypeAudio,
  [OutputFormatMp4]: TypeVideo,
  [OutputFormatPng]: TypeImage,
  [OutputFormatRtmp]: TypeVideo,
  [OutputFormatVideoConcat]: TypeVideo,
}

export const outputDefaultFormatByType = {
  [TypeAudio]: OutputFormatMp3,
  [TypeImage]: OutputFormatPng,
  [TypeVideo]: OutputFormatMp4,
  // [TypeImageSequence]: OutputFormatJpeg,
}


