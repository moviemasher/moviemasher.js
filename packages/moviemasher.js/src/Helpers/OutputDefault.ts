/**
 * @category Utility
 */
import { OutputObject, OutputArgs, VideoStreamOutputObject } from "../Output/Output"
import { Default } from "../Setup/Default"
import { OutputFormat, OutputType } from "../Setup/Enums"

const OutputFilterGraphPadding = 6

const outputDefaultOverDefaults = (overrides?: OutputObject): OutputArgs => {
    const object = overrides || {}
    return {
      ...Default.mash.output,
      ...object,
    }
}

const outputDefaultHls = (overrides?: OutputObject): OutputArgs => {
  const object = overrides || {}

  const outputOptions = {
    ...Default.mash.output,
    format: OutputFormat.Hls, type: OutputType.Video,
    ...object,
  }

  const videoRate = outputOptions.videoRate || Default.mash.output.videoRate!
  const { options = {} } = outputOptions

  return {
    ...outputOptions,
    options: {
      // crf: '21',
      // maxrate: '1M',
      // bufsize: '2M',
      // preset: 'veryslow',
      // keyint_min: '100',
      // sc_threshold: '0',
      // hls_playlist_type: 'event',
      hls_segment_filename: `%0${OutputFilterGraphPadding}d.ts`,
      // hls_time: '4',

      hls_time: 6,
      hls_list_size: 10,
      hls_flags: 'delete_segments',
      hls_delete_threshold: 10,
      g: videoRate * 2, // key frame every two seconds
      ...options
    },
  }
}

const outputDefaultFlv = (overrides?: OutputObject): OutputArgs => {
  const object = overrides || {}
  const baseOptions: OutputObject = { ...object, format: OutputFormat.Flv }
  return outputDefaultOverDefaults(baseOptions)
}

const outputDefaultMp4 = (overrides?: OutputObject): OutputArgs => {
  const object = overrides || {}
  const outputOptions = {
    ...Default.mash.output,
    format: OutputFormat.Mp4, type: OutputType.Video,
    ...object,
  }
  return outputOptions //outputDefaultOverDefaults(baseOptions)
}

// TODO: figure out what this should be
/* from http://underpop.online.fr/f/ffmpeg/help/dash-2.htm.gz
ffmpeg -re -i <input> -map 0 -map 0 -c:a libfdk_aac -c:v libx264
-b:v:0 800k -b:v:1 300k -s:v:1 320x170 -profile:v:1 baseline
-profile:v:0 main -bf 1 -keyint_min 120 -g 120 -sc_threshold 0
-b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1
-window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a"
  - f dash / path / to / out.mpd
*/

const outputDefaultDash = (overrides?: OutputObject): OutputArgs => {
  const object = overrides || {}
  const baseOptions: OutputObject = { ...object, format: OutputFormat.Dash }
  return outputDefaultOverDefaults(baseOptions)
}
const outputDefaultMp3 = (overrides?: OutputObject): OutputArgs => {
  const object = overrides || {}
  const baseOptions: OutputObject = { ...object, format: OutputFormat.Mp3 }
  return outputDefaultOverDefaults(baseOptions)
}

const outputDefaultRtmp = (overrides?: OutputObject): OutputArgs => {
  // IVS suggests, but it currently fails:
  // '-profile:v main', '-preset veryfast', '-x264opts "nal-hrd=cbr:no-scenecut"',
  // '-minrate 3000', '-maxrate 3000', '-g 60'
  const flvOverides = outputDefaultFlv(overrides)

  return flvOverides
}

const outputDefaultSequence = (overrides: OutputObject): OutputArgs => {
  const object = overrides || {}
  const baseOptions: OutputObject = { ...object, format: OutputFormat.Png }
  return outputDefaultOverDefaults(baseOptions)
}
const outputDefaultWaveform = (overrides: OutputObject): OutputArgs => {
  const object = overrides || {}
  const baseOptions: OutputObject = { ...object, format: OutputFormat.Png }
  return outputDefaultOverDefaults(baseOptions)
}

const outputDefaultPng = (overrides: OutputObject): OutputArgs => {
  const object = overrides || {}
  const options: OutputArgs = {
    width: Default.mash.output.width,
    height: Default.mash.output.height,
    options: {},
    type: OutputType.Image,
    format: OutputFormat.Png,
    ...object,
  }
  return options
}

const outputDefaultAudioConcat = (overrides: OutputObject): OutputArgs => {
  const object = overrides || {}
  const baseOptions: OutputObject = { ...object, format: OutputFormat.AudioConcat }
  return outputDefaultOverDefaults(baseOptions)
}

const outputDefaultVideoConcat = (overrides: OutputObject): OutputArgs => {
  const object = overrides || {}
  const baseOptions: OutputObject = { ...object, format: OutputFormat.VideoConcat }
  return outputDefaultOverDefaults(baseOptions)
}

const outputDefaultFromOptions = (overrides: OutputObject): OutputArgs => {
  const { type, format } = overrides
  switch (type) {
    case OutputType.Audio: return outputDefaultMp3(overrides)
    case OutputType.Image: return outputDefaultPng(overrides)
    case OutputType.Video: return outputDefaultMp4(overrides)
    case OutputType.VideoSequence: return outputDefaultSequence(overrides)
    case OutputType.Waveform: return outputDefaultWaveform(overrides)
    default: {
      switch (format) {
        case OutputFormat.Flv: return outputDefaultFlv({ ...overrides, type: OutputType.Video })
        case OutputFormat.Png: return outputDefaultPng({ ...overrides, type: OutputType.Image })
        case OutputFormat.Mp3: return outputDefaultMp3({ ...overrides, type: OutputType.Audio })
        case OutputFormat.Hls: return outputDefaultHls({ ...overrides, type: OutputType.Video })
        case OutputFormat.Dash: return outputDefaultDash({ ...overrides, type: OutputType.Video })
        case OutputFormat.AudioConcat: return outputDefaultAudioConcat({ ...overrides, type: OutputType.Audio })
        case OutputFormat.VideoConcat: return outputDefaultVideoConcat({ ...overrides, type: OutputType.Video })
        case OutputFormat.Mp4:
        default: return outputDefaultMp4({ ...overrides, type: OutputType.Video })
      }
    }
  }
}

const outputDefaultTypeByFormat = {
  [OutputFormat.AudioConcat]: OutputType.Audio,
  [OutputFormat.Dash]: OutputType.Video,
  [OutputFormat.Flv]: OutputType.Video,
  [OutputFormat.Hls]: OutputType.Video,
  [OutputFormat.Jpeg]: OutputType.Image,
  [OutputFormat.Mp3]: OutputType.Audio,
  [OutputFormat.Mp4]: OutputType.Video,
  [OutputFormat.Pipe]: OutputType.Video,
  [OutputFormat.Png]: OutputType.Image,
  [OutputFormat.Rtmp]: OutputType.Video,
  [OutputFormat.Rtmps]: OutputType.Video,
  [OutputFormat.VideoConcat]: OutputType.Video,
}

const outputDefaultFormatByType = {
  [OutputType.Audio]: OutputFormat.Mp3,
  [OutputType.Image]: OutputFormat.Png,
  [OutputType.Video]: OutputFormat.Mp4,
  [OutputType.VideoSequence]: OutputFormat.Png,
  [OutputType.Waveform]: OutputFormat.Png,
}

export {
  outputDefaultFormatByType,
  outputDefaultTypeByFormat,
  outputDefaultHls,
  outputDefaultFlv,
  outputDefaultMp3,
  outputDefaultMp4,
  outputDefaultRtmp,
  outputDefaultDash,
  outputDefaultFromOptions,
  outputDefaultPng,
  outputDefaultWaveform,
  outputDefaultSequence,
}
