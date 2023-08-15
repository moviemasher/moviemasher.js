
import type { OutputOptions, TranscodePlugin, } from '@moviemasher/lib-shared'
import type { StringDataOrError, } from '@moviemasher/runtime-shared'

import { Runtime, TypeTranscode, TypesTranscoding, assertPopulatedString, idGenerateString, outputOptions, urlFilename } from '@moviemasher/lib-shared'
import { EncodingType, ErrorName, TranscodingType, TypeImage, TypeSequence, errorPromise, isAssetType } from '@moviemasher/runtime-shared'
import path from 'path'
import { ffmpegCommand, ffmpegInput, ffmpegOptions, ffmpegSavePromise } from '../../Command/CommandFactory.js'
import { EnvironmentKeyApiDirTemporary } from '../../Environment/ServerEnvironment.js'
import { hashMd5 } from '../../Utility/Hash.js'


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
