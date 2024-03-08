import type { CommandFilters, CommandInput, CommandInputRecord, OutputOptions, StringDataOrError, ValueRecord, VideoOutputOptions, } from '@moviemasher/shared-lib/types.js'
import type { Command, CommandOptions } from '../types.js'

import { $AUDIO, $VIDEO, errorCaught } from '@moviemasher/shared-lib/runtime.js'
import { isNumber, isString } from '@moviemasher/shared-lib/utility/guard.js'
import { sizeNotZero, sizeValueString } from '@moviemasher/shared-lib/utility/rect.js'
import ffmpeg, { FfmpegCommand, FfmpegCommandOptions } from 'fluent-ffmpeg'
import path from 'path'
import { directoryCreate } from '../module/file.js'
import { commandError } from '../utility/command.js'

const commandCombinedOptions = (args: ValueRecord): string[] => Object.entries(args).map(
  ([key, value]) => {
    const keyString = `-${key}`
    const valueString = String(value)
    if (!valueString.length) return keyString
  
    return `${keyString} ${valueString}`
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

export const ffmpegCommand = (): FfmpegCommand => {
  const ffmpegCommandOptions: FfmpegCommandOptions = { logger: console }
  const instance: FfmpegCommand = ffmpeg(ffmpegCommandOptions)
  return instance
}

export const ffmpegOptions = (command: FfmpegCommand, outputOptions: OutputOptions): void => {
  const {
    options = {}, audioBitrate, audioChannels, audioCodec, audioRate,
    videoBitrate, videoCodec, videoRate
  } = outputOptions as VideoOutputOptions
  if (videoBitrate) command.addOutputOption(`-b:v ${videoBitrate}k`)
  if (videoCodec) command.addOutputOption(`-c:v ${videoCodec}`)
  if (videoRate) command.addOutputOption(`-r:v ${videoRate}`)

  if (sizeNotZero(outputOptions)) {
    command.addOutputOption(`-s ${sizeValueString(outputOptions)}`)
  }

  if (audioBitrate) command.addOutputOption(`-b:a ${audioBitrate}k`)
  if (audioChannels) command.addOutputOption(`-ac ${audioChannels}`)
  if (audioCodec) command.addOutputOption(`-c:a ${audioCodec}`)
  if (audioRate) command.addOutputOption(`-r:a ${audioRate}`)
  options.hide_banner = ''
  options.shortest = ''
  command.addOptions(commandCombinedOptions(options))
}

export const ffmpegInput = (command: FfmpegCommand, input: string | CommandInput): void => {
  const inputIsString = isString(input)
  const source = inputIsString ? input : input.source
  command.addInput(source)
  // instance.addInputOption('-re')
  if (inputIsString) return

  const { inputOptions, outputOptions } = input
  if (inputOptions) command.addInputOptions(commandCombinedOptions(inputOptions))
  if (outputOptions) {
    command.addOutputOptions(commandCombinedOptions(outputOptions))
  }
}

const ffmpegInputs = (command: FfmpegCommand, record: CommandInputRecord): void => {
  const inputs = Object.values(record)
  inputs.forEach(input => ffmpegInput(command, input))
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
  
  const { inputsById, output, commandFilters, avType } = args
  if (inputsById) ffmpegInputs(command, inputsById)

  if (avType === $VIDEO) command.noAudio()
  else if (avType === $AUDIO) command.noVideo()
  
  if (commandFilters?.length) ffmpegFilters(command, commandFilters)
  
  ffmpegOptions(command, output)
  return command
}

export const commandPath = (path = 'ffmpeg') => { ffmpeg.setFfmpegPath(path) }
