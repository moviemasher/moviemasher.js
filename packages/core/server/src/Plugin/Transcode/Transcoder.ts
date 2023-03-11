import ffmpeg from 'fluent-ffmpeg'
import path from 'path'

import { 
  TranscodeOutput, errorCaught, ValueRecord, assertPopulatedString, 
  idGenerateString, urlFilename, RenderingCommandOutput, ImageType, 
  VideoType, AudioType, TranscodingType, Runtime 
} from '@moviemasher/moviemasher.js'
import { hashMd5 } from '../../Utility/Hash'
import { TranscodeResponse } from './Transcode'
import { EnvironmentKeyApiDirTemporary } from '../../Environment/ServerEnvironment'

const commandCombinedOptions = (args: ValueRecord): string[] => Object.entries(args).map(
  ([key, value]) => {
    const keyString = `-${key}`
    const valueString = String(value)
    if (valueString.length) return `${keyString} ${valueString}`
    return keyString
  }
)

export interface Transcoder {}
const outputCommand = (inputPath: string, type: TranscodingType, commandOutput: RenderingCommandOutput) => {
  const { 
    options = {},
    videoBitrate, videoCodec, videoRate, width, height, 
    audioBitrate, audioChannels, audioCodec, audioRate
  } = commandOutput
  const command = ffmpeg()
  command.addInput(inputPath)
  if (type === VideoType) {
    if (videoBitrate) command.videoBitrate(videoBitrate)
    if (videoCodec) command.videoCodec(videoCodec)
    if (videoRate) command.fpsOutput(videoRate)
  }
  if (type === VideoType || type === ImageType) {
    if (width && height) command.size([width, height].join('x'))
  }
  if (type === AudioType || type === VideoType) {
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

  const id = idGenerateString()
  const hash = hashMd5(id)
  const { environment } = Runtime
  const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)
    const outputPath = path.resolve(temporaryDirectory, urlFilename(hash, ext))
  assertPopulatedString(localPath)

  const command = outputCommand(localPath, type, options)
  const promise = new Promise<TranscodeResponse>(resolve => {
    command.on('error', (error) => { resolve(errorCaught(error)) })
    command.on('end', () => { resolve({ id }) })
    try { command.save(outputPath) }
    catch (error) { resolve(errorCaught(error)) }
  })
  return promise
}

/*
from RenderingProcessClass

if (upload) {
  const [clip] = this.mashMedia.tracks[0].clips
  const { contentId } = clip
  
  const definition = media.fromId(contentId)
  if (isContentDefinition(definition)) {
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
      // console.log("url", url, "infoPath", infoPath)
      return fs.promises.copyFile(infoPath, path.join(outputDirectory, `upload.${ExtensionLoadedInfo}`)).then(() => {
        return runResult
      })
    }
    
  }
}

*/
