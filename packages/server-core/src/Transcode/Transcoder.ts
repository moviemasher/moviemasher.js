import ffmpeg from 'fluent-ffmpeg'

import { TranscodeOutput, errorFromAny, ValueObject, PotentialError, assertPopulatedString, OutputType, idGenerateString, urlFilename, RenderingCommandOutput, TranscodeType } from '@moviemasher/moviemasher.js'
import { hashMd5 } from '../Utility/Hash'
import { Environment, environment } from '../Utility/Environment'
import path from 'path'
import { TranscodeResponse } from './Transcode'

const commandCombinedOptions = (args: ValueObject): string[] => Object.entries(args).map(
  ([key, value]) => {
    const keyString = `-${key}`
    const valueString = String(value)
    if (valueString.length) return `${keyString} ${valueString}`
    return keyString
  }
)

export interface Transcoder {}
const outputCommand = (inputPath: string, type: TranscodeType, commandOutput: RenderingCommandOutput) => {
  const { 
    options = {},
  videoBitrate, videoCodec, videoRate, width, height, audioBitrate, audioChannels, audioCodec, audioRate
  
  } = commandOutput
  const command = ffmpeg()
  command.addInput(inputPath)
  if (type === TranscodeType.Video) {
    if (videoBitrate) command.videoBitrate(videoBitrate)
    if (videoCodec) command.videoCodec(videoCodec)
    if (videoRate) command.fpsOutput(videoRate)
  }
  if (type === TranscodeType.Video || type === TranscodeType.Image) {
    if (width && height) command.size([width, height].join('x'))
  }
  if (type === TranscodeType.Audio || type === TranscodeType.Video) {
    if (audioBitrate) command.audioBitrate(audioBitrate)
    if (audioChannels) command.audioChannels(audioChannels)
    if (audioCodec) command.audioCodec(audioCodec)
    if (audioRate) command.audioFrequency(audioRate)
  }
  options.hide_banner = ''
  command.addOptions(commandCombinedOptions(options))
  // const extension = path.extname(url)
  return command
}

export const transcode = (localPath: string, output: TranscodeOutput): Promise<TranscodeResponse> => {
  const { options, type } = output
  const { extension, format } = options
  const ext = extension || format
  assertPopulatedString(ext, 'output extension')
  const hash = hashMd5(idGenerateString())
  const temporaryDirectory = environment(Environment.API_DIR_TEMPORARY)
  const outputPath = path.resolve(temporaryDirectory, urlFilename(hash, ext))

  assertPopulatedString(localPath)
  const command = outputCommand(localPath, type, options)
  
  const promise = new Promise<PotentialError>(resolve => {
    const result: TranscodeResponse = {}
    command.on('error', (error) => { resolve(errorFromAny(error)) })
    command.on('end', () => { resolve(result) })
    try { command.save(outputPath) }
    catch (error) { resolve(errorFromAny(error)) }
  })
  return promise
}
