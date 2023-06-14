
import type { 
  OutputOptions, 
  StringDataOrError, TranscodePlugin, 
  } from "@moviemasher/lib-shared"

import path from 'path'

import { 
  TypeSequence, 
  
  Runtime, TypeTranscode, 
  outputOptions,
  assertPopulatedString, idGenerateString, urlFilename, TypesTranscoding 
} from "@moviemasher/lib-shared"
import { hashMd5 } from "../../Utility/Hash.js"
import { EnvironmentKeyApiDirTemporary } from '../../Environment/ServerEnvironment.js'
import { ffmpegCommand, ffmpegInput, ffmpegOptions, ffmpegSavePromise } from "../../Command/CommandFactory.js"
import { EncodingType, ErrorName, TranscodingType, TypeImage, errorPromise, isAssetType } from "@moviemasher/runtime-shared"


class PluginTranscode implements TranscodePlugin {
  constructor(public transcodingType: TranscodingType) {}

  get encodingType(): EncodingType | undefined {
    const { transcodingType } = this
    if (isAssetType(transcodingType)) return transcodingType

    if (transcodingType === TypeSequence) return TypeImage
    return undefined
  }

  transcode(localPath: string, options: OutputOptions): Promise<StringDataOrError> {
    const { extension, format } = options
    const ext = extension || format || path.extname(localPath).slice(1)
    assertPopulatedString(ext, 'output extension')

    const id = idGenerateString()
    const hash = hashMd5(id)
    const { environment } = Runtime
    const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)
    const outputPath = path.resolve(temporaryDirectory, urlFilename(hash, ext))
    assertPopulatedString(localPath)

    const { encodingType } = this
    if (encodingType) {
      const populatedOptions = outputOptions(this.transcodingType, options)
      const command = ffmpegCommand()
      ffmpegInput(command, localPath)
      ffmpegOptions(command, populatedOptions)
      return ffmpegSavePromise(command, outputPath)
    } else {
      // font

      return errorPromise(ErrorName.Internal)
    }
  }
  type = TypeTranscode
}

TypesTranscoding.forEach(type => {
  Runtime.plugins[TypeTranscode][type] ||= new PluginTranscode(type)
})
