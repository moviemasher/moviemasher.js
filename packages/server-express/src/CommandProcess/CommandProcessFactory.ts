import { isPopulatedObject, ValueObject } from '@moviemasher/moviemasher.js'
import ffmpeg, { FfmpegCommandLogger, FfmpegCommandOptions } from 'fluent-ffmpeg'
import path from 'path'
import { CommandArgs, commandInputOptions } from '../Command/Command'
import { CommandProcess } from './CommandProcess'

const commandProcessInstance = (args: CommandArgs): CommandProcess => {
  const logger: FfmpegCommandLogger = {
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    info: console.info,
  }
  const ffmpegOptions: FfmpegCommandOptions = {logger}
  const instance: ffmpeg.FfmpegCommand = ffmpeg(ffmpegOptions)
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
