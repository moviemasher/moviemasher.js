
import type { EncodingType, StringDataOrError, TranscodeOptions, TranscodingType } from '@moviemasher/runtime-shared'

import { assertPopulatedString, idGenerateString, urlFilename , outputOptions} from '@moviemasher/lib-shared'
import { EventServerTranscode } from '@moviemasher/runtime-server'
import { ERROR, IMAGE, SEQUENCE, errorPromise, isAssetType } from '@moviemasher/runtime-shared'
import path from 'path'
import { ffmpegCommand, ffmpegInput, ffmpegOptions, ffmpegSavePromise } from '../RunningCommand/Command/CommandFactory.js'
import { ENV, ENVIRONMENT } from '../Environment/EnvironmentConstants.js'
import { hashMd5 } from '../Utility/Hash.js'

const transcodeEncodingType = (transcodingType: TranscodingType): EncodingType | undefined  =>{
    if (isAssetType(transcodingType)) return transcodingType

    if (transcodingType === SEQUENCE) return IMAGE
    return undefined
  }

const transcode = (transcodingType: TranscodingType, localPath: string, options: TranscodeOptions): Promise<StringDataOrError> => {
  const { extension, format } = options
  const ext = extension || format || path.extname(localPath).slice(1)
  assertPopulatedString(ext, 'output extension')

  const id = idGenerateString()
  const hash = hashMd5(id)
  const temporaryDirectory = ENVIRONMENT.get(ENV.ApiDirTemporary)
  const outputPath = path.resolve(temporaryDirectory, urlFilename(hash, ext))
  assertPopulatedString(localPath)

  const encodingType = transcodeEncodingType(transcodingType)
  if (encodingType) {
    const populatedOptions = outputOptions(transcodingType, options)
    const command = ffmpegCommand()
    ffmpegInput(command, localPath)
    ffmpegOptions(command, populatedOptions)
    return ffmpegSavePromise(command, outputPath)
  } else {
    // font

    return errorPromise(ERROR.Internal)
  }
}
const handler = (event: EventServerTranscode) => {
  const { detail } = event
  const { inputPath, transcodeOptions, transcodingType } = detail
  detail.promise = transcode(transcodingType, inputPath, transcodeOptions)
}

export const ServerTranscodeListeners = () => ({
  [EventServerTranscode.Type]: handler,
})
