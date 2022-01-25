import { isPopulatedObject, ValueObject } from '@moviemasher/moviemasher.js'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { CommandArgs, commandInputOptions } from '../Command/Command'
import { CommandProcess } from './CommandProcess'

const commandProcessInstance = (args: CommandArgs): CommandProcess => {
  const instance: ffmpeg.FfmpegCommand = ffmpeg()
  const { inputs, output, destination, complexFilter } = args

  inputs.forEach(({ source, options }) => {
    // console.log("commandProcessInstance adding", source)
    instance.addInput(source)
    // instance.addInputOption('-re')
    if (options) instance.addInputOptions(commandInputOptions(options))
  })

  if (complexFilter.length) {
    instance.complexFilter(complexFilter)
  }

  const options: ValueObject = output.options || {}
  if (output.audioCodec) instance.audioCodec(output.audioCodec)
  if (output.audioBitrate) instance.audioBitrate(output.audioBitrate)
  if (output.audioChannels) instance.audioChannels(output.audioChannels)
  if (output.audioRate) instance.audioFrequency(output.audioRate)

  if (output.videoCodec) instance.videoCodec(output.videoCodec)
  // if (output.width && output.height) instance.size(`${output.width}x${output.height}`)
  if (output.videoRate) instance.fpsOutput(output.videoRate)

  if (output.format) {
    instance.format(output.format)
    if (output.format === 'hls' && typeof destination === 'string') {
      const { hls_segment_filename: filename } = options
      if (typeof filename === 'string' && !filename.includes('/')) {
        options.hls_segment_filename = `${path.dirname(destination)}/${filename}`
      }
    }
  }
  if (isPopulatedObject(options)) instance.addOptions(commandInputOptions(options))

  instance.output(destination)
  return instance
}
const commandProcessPath = (path = 'ffmpeg') => { ffmpeg.setFfmpegPath(path) }

const CommandProcessFactory = {
  instance: commandProcessInstance,
  path: commandProcessPath,
}

export { CommandProcessFactory }
