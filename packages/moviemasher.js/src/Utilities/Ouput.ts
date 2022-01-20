import { CommandInput, CommandOptions } from "../../../server-node/src/Command/Command"
import { GraphInput, Segment, ValueObject } from "../declarations"
import { OutputObject, OutputOptions } from "../Output/Output"
import { Default } from "../Setup/Default"
import { OutputFormat } from "../Setup/Enums"

const OutputSegmentPadding = 6


const optionsOutput = (overrides?: OutputOptions): OutputObject => {
    const object = overrides || {}
    return {
      ...Default.mash.output,
      ...object,
    }
}


const outputHls = (overrides?: OutputObject): OutputObject => {
  const object = overrides || {}
  const baseOptions = { ...object, format: OutputFormat.Hls }
  const outputOptions = optionsOutput(baseOptions)

  const { fps = Default.mash.output.fps } = outputOptions
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
      hls_segment_filename: `%0${OutputSegmentPadding}d.ts`,
      // hls_time: '4',

      hls_time: 6,
      hls_list_size: 10,
      hls_flags: 'delete_segments',
      g: fps * 2, // key frame every two seconds
      ...options
    },
  }
}

const outputFlv = (overrides?: OutputObject): OutputObject => {
  const object = overrides || {}
  const baseOptions: OutputOptions = { ...object, format: 'flv' }
  return optionsOutput(baseOptions)
}

const outputMp4 = (overrides?: OutputObject): OutputObject => {
  const object = overrides || {}
  const baseOptions: OutputOptions = { ...object, format: 'mp4' }
  return optionsOutput(baseOptions)
}
const outputMp3 = (overrides?: OutputObject): OutputObject => {
  const object = overrides || {}
  const baseOptions: OutputOptions = { ...object, format: 'mp3' }
  return optionsOutput(baseOptions)
}

const outputRtmp = (overrides?: OutputObject): OutputObject => {
  // IVS suggests, but it currently fails:
  // '-profile:v main', '-preset veryfast', '-x264opts "nal-hrd=cbr:no-scenecut"',
  // '-minrate 3000', '-maxrate 3000', '-g 60'
  const flvOverides = outputFlv(overrides)

  return flvOverides
}

export { outputHls, outputFlv, outputMp3, outputMp4, outputRtmp }
