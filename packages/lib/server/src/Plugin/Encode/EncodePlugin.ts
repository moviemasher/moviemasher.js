// import EventEmitter from 'events'

import type { EncodePlugin, MashAssetObject, OutputOptions, StringDataOrError } from '@moviemasher/lib-shared'
import type { RenderingProcessArgs } from './RenderingProcess/RenderingProcess.js'

import path from 'path'
import fs from 'fs'

import { CommaChar, Runtime, TypeEncode, idGenerateString, assertPopulatedString } from '@moviemasher/lib-shared'
import { renderingProcessInstance } from './RenderingProcess/RenderingProcessFactory.js'
import {
  EnvironmentKeyApiDirCache, EnvironmentKeyApiDirFilePrefix,
  EnvironmentKeyApiDirTemporary, EnvironmentKeyApiDirValid
} from '../../Environment/ServerEnvironment.js'
import { assertFilePath } from '../../Utility/File.js'
import { hashMd5 } from '../../Utility/Hash.js'
import { AssetType, TypesAsset } from '@moviemasher/runtime-shared'

class PluginEncode implements EncodePlugin {
  constructor(public encodingType: AssetType) {}

  encode(localPath: string, options: OutputOptions): Promise<StringDataOrError> {
    const id = idGenerateString()
    const hash = hashMd5(id)
    const { extension, format } = options
    const ext = extension || format || path.extname(localPath).slice(1)
    assertPopulatedString(ext, 'output extension')

    const { environment } = Runtime
    const temporaryDirectory = environment.get(EnvironmentKeyApiDirTemporary)
    const outputDirectory = path.join(temporaryDirectory, hash)
    const cacheDirectory = environment.get(EnvironmentKeyApiDirCache)
    const filePrefix = environment.get(EnvironmentKeyApiDirFilePrefix)
    const validDirectories = environment.get(EnvironmentKeyApiDirValid).split(CommaChar)
    const defaultDirectory = ''

    assertFilePath(localPath)
    return fs.promises.readFile(localPath).then(buffer => {
      const json = buffer.toString()
      const mash: MashAssetObject = JSON.parse(json)

      const args: RenderingProcessArgs = {
        temporaryDirectory, cacheDirectory, filePrefix, validDirectories,
        outputDirectory, defaultDirectory,
        mash,
        encodingType: this.encodingType,
        outputOptions: options,
      }
      
      const renderingProcess = renderingProcessInstance(args)
      return renderingProcess.runPromise()
    })
  }

  type = TypeEncode
}

TypesAsset.forEach(type => {
  Runtime.plugins[TypeEncode][type] ||= new PluginEncode(type)
})
