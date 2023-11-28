import type { CommandFilters, CommandInputs } from '@moviemasher/runtime-server'
import type { OutputOptions, StringDataOrError, ValueRecord, VideoOutputOptions, } from '@moviemasher/runtime-shared'
import type { CommandOptions } from '../../encode/MashDescriberTypes.js'
import type { Command } from './Command.js'

import { AUDIO, ERROR, VIDEO, errorCaught, errorPromise, isNumber, namedError } from '@moviemasher/runtime-shared'
import ffmpeg, { FfmpegCommand, FfmpegCommandOptions } from 'fluent-ffmpeg'
import path from 'path'
import { commandError } from '../../Utility/Command.js'
import { directoryCreate } from '../../Utility/File.js'

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
      const commaRegex = /,/g

      if (!value.length) return key.replace(commaRegex, '\\,')

      const commasEscaped = value.replace(commaRegex, '\\,')
      const colonRegex = /:/g
      const colonsEscaped = commasEscaped.replace(colonRegex, '\\\\:')
      return `${key}=${colonsEscaped}`
    }).join(':')
    return { ...rest, options: newOptions, filter: ffmpegFilter }
  })
}

export const commandPromise = async (command: FfmpegCommand) => {
  return await new Promise<StringDataOrError>(resolve => {
    command.on('error', (...args: any[]) => {
      resolve(namedError(ERROR.Ffmpeg, args.join(','))) 
    })
    command.on('end', () => { resolve({ data: 'OK' }) })
    try {
      // console.log('ARGUMENTS', ...command._getArguments())
      command.run()
    }
    catch (err) { resolve(errorCaught(err)) }
  }).catch(error => errorPromise(ERROR.Ffmpeg, error))
}

export const ffmpegCommand = (): FfmpegCommand => {
  const ffmpegCommandOptions: FfmpegCommandOptions = { logger: console }
  const instance: FfmpegCommand = ffmpeg(ffmpegCommandOptions)
  instance.addOption('-hide_banner')
  return instance
}

export const ffmpegOptions = (command: FfmpegCommand, outputOptions: OutputOptions): void => {
  const {
    options = {}, audioBitrate, audioChannels, audioCodec, audioRate,
    videoBitrate, videoCodec, videoRate, width, height
  } = outputOptions as VideoOutputOptions
  if (videoBitrate) command.addOutputOption(`-b:v ${videoBitrate}k`)
  if (videoCodec) command.addOutputOption(`-c:v ${videoCodec}`)
  if (videoRate) command.addOutputOption(`-r:v ${videoRate}`)

  if (width && height) {
    command.addOutputOption(`-s ${[width, height].join('x')}`)
  }

  if (audioBitrate) command.addOutputOption(`-b:a ${audioBitrate}k`)
  if (audioChannels) command.addOutputOption(`-ac ${audioChannels}`)
  if (audioCodec) command.addOutputOption(`-c:a ${audioCodec}`)
  if (audioRate) command.addOutputOption(`-r:a ${audioRate}`)
  options.hide_banner = ''
  options.shortest = ''
  command.addOptions(commandCombinedOptions(options))
}

export const ffmpegInput = (command: FfmpegCommand, source: string, options?: ValueRecord): void => {
  command.addInput(source)
  // instance.addInputOption('-re')
  if (options) command.addInputOptions(commandCombinedOptions(options))
}

export const ffmpegInputs = (command: FfmpegCommand, inputs: CommandInputs): void => {
  inputs.forEach(input => {
    const { source, options } = input
    ffmpegInput(command, source, options)
  })
}

export const ffmpegSavePromise = (command: FfmpegCommand, outputPath: string): Promise<StringDataOrError> => {
  const promise = new Promise<StringDataOrError>(resolve => {
    command.on('error', (error, stdout, stderr) => { 
      resolve(errorCaught({ error: commandError(command._getArguments(), outputPath, error, stderr, stdout) })) 
    })
    command.on('end', () => { resolve({ data: outputPath }) })
    try { 
      
      directoryCreate(path.dirname(outputPath))
      command.save(outputPath) }
    catch (error) { resolve(errorCaught(error)) }
  })
  return promise
}

export const ffmpegFilters = (command: FfmpegCommand, commandFilters: CommandFilters): void => {
  command.complexFilter(commandComplexFilter(commandFilters))
    const last = commandFilters[commandFilters.length - 1]
    last.outputs.forEach(output => {
      command.map(`[${output}]`)
    })
    // instance.addOption('-filter_complex_threads 1')
}

export const commandInstance = (args: CommandOptions): Command => {
  const command = ffmpegCommand()
  
  const { inputs, output, commandFilters, avType } = args
  if (inputs) ffmpegInputs(command, inputs)


  if (avType === VIDEO) command.noAudio()
  else if (avType === AUDIO) command.noVideo()
  
  // console.log("commandInstance GRAPHFILTERS", commandFilters)

  if (commandFilters?.length) ffmpegFilters(command, commandFilters)
  
  ffmpegOptions(command, output)
  return command
}

export const commandPath = (path = 'ffmpeg') => { ffmpeg.setFfmpegPath(path) }
