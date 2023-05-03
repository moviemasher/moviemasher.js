import ffmpeg, { FfmpegCommandLogger, FfmpegCommandOptions } from 'fluent-ffmpeg'
import {
  CommandFilters, isAboveZero, isPopulatedString, isNumber, 
  isPopulatedObject, isValue, ValueRecord, ColonRegex, CommaRegex, AVTypeAudio, AVTypeVideo
} from '@moviemasher/lib-core'

import { Command } from './Command'
import { CommandOptions } from '../Plugin/Encode/Encode'



const commandCombinedOptions = (args: ValueRecord): string[] => Object.entries(args).map(
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
      if (isNumber(value)) return `${key}=${value}`

      if (!value.length) return key.replace(CommaRegex, '\\,')

      const commasEscaped = value.replace(CommaRegex, '\\,')
      const colonsEscaped = commasEscaped.replace(ColonRegex, '\\\\:')
      return `${key}=${colonsEscaped}`
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
  if (avType === AVTypeVideo) instance.noAudio()
  else if (avType === AVTypeAudio) instance.noVideo()
  inputs?.forEach(({ source, options }) => {
    // console.log("commandInstance adding", source)
    instance.addInput(source)
    // instance.addInputOption('-re')
    if (options) instance.addInputOptions(commandCombinedOptions(options))
  })
  // console.log("commandInstance GRAPHFILTERS", commandFilters)

  if (commandFilters?.length) {
    instance.complexFilter(commandComplexFilter(commandFilters))
    const last = commandFilters[commandFilters.length - 1]
    last.outputs.forEach(output => {
      instance.map(`[${output}]`)
    })
    // instance.addOption('-filter_complex_threads 1')
  }
  if (avType !== AVTypeVideo) {
    if (isPopulatedString(output.audioCodec)) instance.audioCodec(output.audioCodec)
    if (isValue(output.audioBitrate)) instance.audioBitrate(output.audioBitrate)
    if (isAboveZero(output.audioChannels)) instance.audioChannels(output.audioChannels)
    if (isAboveZero(output.audioRate)) instance.audioFrequency(output.audioRate)
  }
  if (avType !== AVTypeAudio) {
    if (isPopulatedString(output.videoCodec)) instance.videoCodec(output.videoCodec)
    if (isAboveZero(output.videoRate)) instance.fpsOutput(output.videoRate)
  }
  // if (isPopulatedString(output.format) && output.format !== OutputFormatPng) instance.format(output.format)

  const options: ValueRecord = output.options || {}
  const instanceOptions = isPopulatedObject(options) ? options : {}
  instanceOptions.hide_banner = ''
  instanceOptions.shortest = ''
  // instance.addOutputOption('-shortest')
  instance.addOptions(commandCombinedOptions(instanceOptions))
  return instance
}

export const commandPath = (path = 'ffmpeg') => { ffmpeg.setFfmpegPath(path) }
