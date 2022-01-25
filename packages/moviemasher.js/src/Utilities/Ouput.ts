/**
 * @module Output
 * @category Utility
 */
import { OutputObject, OutputOptions } from "../Output/Output"
import { Default } from "../Setup/Default"
import { OutputFormat, OutputType } from "../Setup/Enums"

const OutputSegmentPadding = 6

const optionsOutput = (overrides?: OutputOptions): OutputObject => {
    const object = overrides || {}
    return {
      ...Default.mash.output,
      ...object,
    }
}

const outputHls = (overrides?: OutputOptions): OutputObject => {
  const object = overrides || {}
  const baseOptions = { ...object, format: OutputFormat.Hls, type: OutputType.VideoStream }
  const outputOptions = optionsOutput(baseOptions)

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
      hls_segment_filename: `%0${OutputSegmentPadding}d.ts`,
      // hls_time: '4',

      hls_time: 6,
      hls_list_size: 10,
      hls_flags: 'delete_segments',
      g: videoRate * 2, // key frame every two seconds
      ...options
    },
  }
}

const outputFlv = (overrides?: OutputOptions): OutputObject => {
  const object = overrides || {}
  const baseOptions: OutputOptions = { ...object, format: 'flv' }
  return optionsOutput(baseOptions)
}

const outputMp4 = (overrides?: OutputOptions): OutputObject => {
  const object = overrides || {}
  const baseOptions: OutputOptions = { ...object, format: 'mp4' }
  return optionsOutput(baseOptions)
}

const outputMp3 = (overrides?: OutputOptions): OutputObject => {
  const object = overrides || {}
  const baseOptions: OutputOptions = { ...object, format: 'mp3' }
  return optionsOutput(baseOptions)
}

const outputRtmp = (overrides?: OutputOptions): OutputObject => {
  // IVS suggests, but it currently fails:
  // '-profile:v main', '-preset veryfast', '-x264opts "nal-hrd=cbr:no-scenecut"',
  // '-minrate 3000', '-maxrate 3000', '-g 60'
  const flvOverides = outputFlv(overrides)

  return flvOverides
}

export { outputHls, outputFlv, outputMp3, outputMp4, outputRtmp }
