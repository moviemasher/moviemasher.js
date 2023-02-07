import { CommandOutput, Errors, NumberObject, OutputFormat, OutputType, RenderingCommandOutput } from "@moviemasher/moviemasher.js"


import outputDefaultAudioJson from './audio.json'
import outputDefaultFontJson from './font.json'
import outputDefaultImagePngJson from './imagepng.json'
import outputDefaultVideoJson from './video.json'
import outputDefaultImageSequenceJson from './imagesequence.json'
import outputDefaultWaveformJson from './waveform.json'
import outputDefaultDashJson from './dash.json'
import outputDefaultHlsJson from './hls.json'
import outputDefaultRtmpJson from './rtmp.json'
import outputDefaultImageJson from './image.json'
import { StreamingCommandOutput } from "../Stream/StreamingCommandOutput"

export const outputDefaultAudio = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultAudioJson as RenderingCommandOutput
  return { ...commandOutput,  ...object }
}

export const outputDefaultFont = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultFontJson as RenderingCommandOutput
  return { ...commandOutput,  ...object }
}


export const outputDefaultVideo = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultVideoJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}
export const outputDefaultImageSequence = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultImageSequenceJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}
export const outputDefaultWaveform = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultWaveformJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}

export const outputDefaultPng = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultImagePngJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}
export const outputDefaultImage = (overrides?: CommandOutput): RenderingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultImageJson as RenderingCommandOutput
  return { ...commandOutput, ...object }
}

export const outputDefaultPopulate = (overrides: RenderingCommandOutput): RenderingCommandOutput => {
  const { outputType } = overrides
  switch (outputType) {
    case OutputType.Audio: return outputDefaultAudio(overrides)
    case OutputType.Image: return outputDefaultImage(overrides)
    case OutputType.Video: return outputDefaultVideo(overrides)
    case OutputType.Font: return outputDefaultFont(overrides)
    // case OutputType.ImageSequence: return outputDefaultImageSequence(overrides)
  }
  throw new Error(Errors.type)
}

export const outputDefaultRendering = (outputType: OutputType, overrides?: CommandOutput): RenderingCommandOutput => {
  return outputDefaultPopulate({ ...overrides, outputType })
}


export const renderingCommandOutput = (output: RenderingCommandOutput): RenderingCommandOutput => {
  const counts: NumberObject = {}
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
  [OutputFormat.AudioConcat]: OutputType.Audio,
  [OutputFormat.Mdash]: OutputType.Video,
  [OutputFormat.Flv]: OutputType.Video,
  [OutputFormat.Hls]: OutputType.Video,
  [OutputFormat.Jpeg]: OutputType.Image,
  [OutputFormat.Mp3]: OutputType.Audio,
  [OutputFormat.Mp4]: OutputType.Video,
  [OutputFormat.Png]: OutputType.Image,
  [OutputFormat.Rtmp]: OutputType.Video,
  [OutputFormat.VideoConcat]: OutputType.Video,
}

export const outputDefaultFormatByType = {
  [OutputType.Audio]: OutputFormat.Mp3,
  [OutputType.Image]: OutputFormat.Png,
  [OutputType.Video]: OutputFormat.Mp4,
  // [OutputType.ImageSequence]: OutputFormat.Jpeg,
}

export const outputDefaultStreaming = (overrides: CommandOutput): StreamingCommandOutput => {
  const { format } = overrides
  switch (format) {
    case OutputFormat.Mdash: return outputDefaultDash(overrides)
    case OutputFormat.Rtmp: return outputDefaultRtmp(overrides)
    case OutputFormat.Hls:
    default: return outputDefaultHls(overrides)
  }
}

export const outputDefaultHls = (overrides?: CommandOutput): StreamingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultHlsJson as StreamingCommandOutput
  return { ...commandOutput, ...object }
}

export const outputDefaultDash = (overrides?: CommandOutput): StreamingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultDashJson as StreamingCommandOutput
  return { ...commandOutput, ...object }

  // TODO: figure out what this should be
/* from http://underpop.online.fr/f/ffmpeg/help/dash-2.htm.gz
ffmpeg -re -i <input> -map 0 -map 0 -c:a libfdk_aac -c:v libx264
-b:v:0 800k -b:v:1 300k -s:v:1 320x170 -profile:v:1 baseline
-profile:v:0 main -bf 1 -keyint_min 120 -g 120 -sc_threshold 0
-b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1
-window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a"
  - f dash / path / to / out.mpd
*/
}

export const outputDefaultRtmp = (overrides?: CommandOutput): StreamingCommandOutput => {
  const object = overrides || {}
  const commandOutput = outputDefaultRtmpJson as StreamingCommandOutput
  return { ...commandOutput, ...object }

  // TODO: figure out what this should be
  // IVS suggests, but it currently fails:
  // '-profile:v main', '-preset veryfast', '-x264opts "nal-hrd=cbr:no-scenecut"',
  // '-minrate 3000', '-maxrate 3000', '-g 60'
}
