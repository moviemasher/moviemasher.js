import {
  CommandFilters, CommandInputs, OutputOptions, StringDataOrError, ValueRecord, 
  VideoOutputOptions,
  sizeString
} from '@moviemasher/lib-core'
import type { Command } from './Command.js'
import type { CommandOptions } from '../Plugin/Encode/Encode.js'

import ffmpeg, { FfmpegCommand, FfmpegCommandOptions } from 'fluent-ffmpeg'

import {
  isNumber, ColonRegex, CommaRegex, AVTypeAudio, AVTypeVideo, errorCaught,
} from '@moviemasher/lib-core'
import { commandArgsString } from '../Utility/Command.js'
  

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

export const ffmpegCommand = (): FfmpegCommand => {
  const ffmpegCommandOptions: FfmpegCommandOptions = { logger: console }
  const instance: FfmpegCommand = ffmpeg(ffmpegCommandOptions)
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
    command.on('error', (error) => { 
      resolve(errorCaught({ error: commandArgsString(command._getArguments(), outputPath, error) })) 
    })
    command.on('end', () => { resolve({ data: outputPath }) })
    try { command.save(outputPath) }
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


  if (avType === AVTypeVideo) command.noAudio()
  else if (avType === AVTypeAudio) command.noVideo()
  
  // console.log("commandInstance GRAPHFILTERS", commandFilters)

  if (commandFilters?.length) ffmpegFilters(command, commandFilters)
  
  ffmpegOptions(command, output)
  return command
}

export const commandPath = (path = 'ffmpeg') => { ffmpeg.setFfmpegPath(path) }




/*
from RenderingProcessClass

if (upload) {
  const [clip] = this.mashMedia.tracks[0].clips
  const { contentId } = clip
  
  const definition = media.fromId(contentId)
  if (isContentAsset(definition)) {
    const { source: file, loadType: type } = definition
    const { preloader, args } = this
    const { outputDirectory } = args
    const graphFile: GraphFile = {
      input: true, definition, type, file
    }
    assertLoadType(type)
    
    const url = preloader.key(graphFile)
    const infoPath = preloader.infoPath(url)
    
    if (fs.existsSync(infoPath)) {
      // console.log('url', url, 'infoPath', infoPath)
      return fs.promises.copyFile(infoPath, path.join(outputDirectory, `upload.${ExtensionLoadedInfo}`)).then(() => {
        return runResult
      })
    }
    
  }
}

const transcodeFileName = (index: number, commandOutput: RenderingCommandOutput, renderingOutput: RenderingOutput): string => {
  const { videoRate } = commandOutput

  if (!videoRate) return errorThrow(ErrorName.Internal)

  const { format, extension, basename = '' } = commandOutput
  const ext = extension || format
  const { duration } = renderingOutput
  const framesMax = Math.floor(videoRate * duration) - 2
  const begin = 1
  const lastFrame = begin + (framesMax - begin)
  const padding = String(lastFrame).length
  return `${basename}%0${padding}d.${ext}`
}

*/