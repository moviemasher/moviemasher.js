import ffmpeg, { FfmpegCommandLogger, FfmpegCommandOptions } from 'fluent-ffmpeg'
import {
  AVType,
  CommandFilters,
  CommandOptions, GraphFilters, isPopulatedObject, OutputFormat, ValueObject
} from '@moviemasher/moviemasher.js'

import { Command } from './Command'

const commandInputOptions = (args: ValueObject): string[] => Object.entries(args).map(
  ([key, value]) => {
    const keyString = `-${key}`
    const valueString = String(value)
    if (valueString.length) return `${keyString} ${valueString}`
    return keyString
  }
)

const commandComplexFilter = (args: CommandFilters): ffmpeg.FilterSpecification[] => {
  return args.map(commandFilter => {
    const { options, ffmpegFilter, ...rest } = commandFilter
    const newOptions = Object.entries(options).map(([key, value]) => {
      const valueString = String(value).replaceAll(',', '\\,')
      if (valueString.length) return `${key}=${valueString}`

      return key.replaceAll(',', '\\,')
    }).join(':')
    return { ...rest, options: newOptions, filter: ffmpegFilter }
  })
}

export const commandProcess = (): ffmpeg.FfmpegCommand => {
   const logger: FfmpegCommandLogger = {
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    info: console.info,
  }
  const ffmpegOptions: FfmpegCommandOptions = { logger }
  const instance: ffmpeg.FfmpegCommand = ffmpeg(ffmpegOptions)
  return instance
}

export const commandInstance = (args: CommandOptions): Command => {
  const instance: ffmpeg.FfmpegCommand = commandProcess()
  const { inputs, output, commandFilters, avType } = args
  if (avType === AVType.Video) instance.noAudio()
  else if (avType === AVType.Audio) instance.noVideo()
  inputs?.forEach(({ source, options }) => {
    // console.log("commandInstance adding", source)
    instance.addInput(source)
    // instance.addInputOption('-re')
    if (options) instance.addInputOptions(commandInputOptions(options))
  })
  // console.log("commandInstance GRAPHFILTERS", commandFilters)

  if (commandFilters?.length) {
    instance.complexFilter(commandComplexFilter(commandFilters))
    const last = commandFilters[commandFilters.length - 1]
    last.outputs.forEach(output => {
      instance.map(`[${output}]`)
    })
  }

  if (output.audioCodec) instance.audioCodec(output.audioCodec)
  if (output.audioBitrate) instance.audioBitrate(output.audioBitrate)
  if (output.audioChannels) instance.audioChannels(output.audioChannels)
  if (output.audioRate) instance.audioFrequency(output.audioRate)

  if (output.videoCodec) instance.videoCodec(output.videoCodec)
  // if (output.width && output.height) instance.size(`${output.width}x${output.height}`)
  if (output.videoRate) instance.fpsOutput(output.videoRate)

  if (output.format && output.format !== OutputFormat.Png) instance.format(output.format)

  const options: ValueObject = output.options || {}
  if (isPopulatedObject(options)) instance.addOptions(commandInputOptions(options))

  return instance
}

export const commandPath = (path = 'ffmpeg') => { ffmpeg.setFfmpegPath(path) }
