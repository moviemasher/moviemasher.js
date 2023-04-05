import type {
  UploadType, PotentialError,
  MediaDataArrayOrError,
  Masher, Strings, MediaDataOrError, MasherOptions, PluginDataOrErrorPromiseFunction, PluginDataOrErrorFunction
} from '@moviemasher/lib-core'
import type { 
  ClientLimits, ClientReadParams, LocalClient, LocalClientOptions, ClientImportArgs, 
  ClientOperationArgs, ClientPluginArgs, ClientReadArgs, 
  ImportOperation, LocalClientArgs, LocalOperation, PluginOperation, 
  ReadOperation, LocalOperations 
} from './LocalClient.js'

import {
  isStorableType, isTyped, mediaTypeFromMime,
  isMediaObject,
  mediaDefinition,
  requestRecordsPromise,
  assertMediaObject,
  Emitter,
  Runtime,
  TypeMasher,
  errorThrow, isEncodingType,
  JsonMimetype, requestPopulate, requestRecordPromise, TypeVideo,
  ErrorName, error, AsteriskChar, CommaChar, errorPromise, isDefiniteError,
  TypesEncoding, isAboveZero, SlashChar, TypesStorable, pluginDataOrError,
  pluginDataOrErrorPromise, assertObject
} from '@moviemasher/lib-core'

import { 
  DefaultLocalClientArgs, OperationRead, OperationsLocal, isLocalOperation, 
  OperationImport, OperationPlugin 
} from './LocalClient.js'
import { fileMediaObjectPromise } from './File.js'



export class LocalClientClass implements LocalClient {
  constructor(public options?: LocalClientOptions) {
    this.plugin = pluginDataOrError
    this.pluginPromise = pluginDataOrErrorPromise

  }

  enabled(operation?: LocalOperation | LocalOperations): boolean {
    const { localClientArgs } = this
    const operations = isLocalOperation(operation) ? [operation] : OperationsLocal
    return operations.every(operation => Boolean(localClientArgs[operation]))
  }

  eventTarget = new Emitter()

  get fileAccept(): string {
    const { localClientArgs: args } = this
    const { [OperationImport]: importArgs } = args
    if (!importArgs)
      return ''


    const { uploadLimits } = importArgs
    if (!uploadLimits)
      return ''

    const accept: Strings = []
    TypesEncoding.forEach(type => {
      const limit = uploadLimits[type]
      if (isAboveZero(limit))
        accept.push(`${type}${SlashChar}${AsteriskChar}`)
    })
    if (TypesStorable.some(type => isAboveZero(uploadLimits[type]))) {
      accept.push(JsonMimetype)
    }
    return accept.join(CommaChar)
  }

  private fileError(file: File, uploadLimits: ClientLimits): Promise<PotentialError> {
    const { type: mimetype } = file
    if (mimetype === JsonMimetype) {
      return file.text().then(text => {
        const json = JSON.parse(text)
        if (!isTyped(json))
          return error(ErrorName.ImportType, { value: '' })

        const { type } = json
        if (!isStorableType(type))
          return error(ErrorName.ImportType, { value: type })

        return this.fileSizeError(file, uploadLimits, type)
      })
    }
    const coreType = mediaTypeFromMime(mimetype)

    if (!isEncodingType(coreType))
      return errorPromise(ErrorName.ImportType, { value: coreType || '' })

    return Promise.resolve(this.fileSizeError(file, uploadLimits, coreType))
  }

  private fileSizeError(file: File, uploadLimits: ClientLimits, type: UploadType): PotentialError {
    const { size } = file
    const max = uploadLimits[type]
    if (!isAboveZero(max))
      return error(ErrorName.ClientDisabledSave, 'max')
    const sizeInMeg = Math.ceil(size * 10 / 1024 / 1024) / 10
    if (sizeInMeg > max) {
      return error(ErrorName.ImportSize, { value: sizeInMeg, limit: max })
    }
    return {}
  }

  // TODO: support limiting by file extension
  fileMedia(file: File): Promise<MediaDataOrError> {
    const { localClientArgs: clientArgs } = this
    const { [OperationImport]: importArgs } = clientArgs
    if (!importArgs)
      return errorPromise(ErrorName.ClientDisabledSave, 'importArgs')

    const { uploadLimits } = importArgs
    if (!uploadLimits)
      return errorPromise(ErrorName.ClientDisabledSave, 'limits')

    return this.fileError(file, uploadLimits).then(orError => {
      if (isDefiniteError(orError))
        return orError

      return fileMediaObjectPromise(file).then(orError => {
        if (isDefiniteError(orError))
          return orError

        const { data: mediaObject } = orError
        return { data: mediaDefinition(mediaObject) }
      })
    })
  }

  //   const { name, size, type } = file
  //   const coreType = mediaTypeFromMime(type) 
  //     console.log('dropFilesFromList file', file, type)
  //   if (!isEncodingType(coreType)) {
  //     infos.push({ label: name, value: coreType, error: 'import.type' })
  //     return
  //   }
  //   const max = limitsByType[coreType]
  //   if (exists && !(isAboveZero(max) && max * 1024 * 1024 > size)) {
  //     infos.push({ label: name, value: `${max}MB`, error: 'import.bytes' })
  //     return
  //   }
  //   const ext = name.toLowerCase().split('.').pop()
  //   const extDefined = isPopulatedString(ext)
  //   const exts = extensionsByType[coreType]
  //   if (exists || !extDefined) {
  //     if (!(extDefined && isArray(exts) && exts.includes(ext))) {
  //       infos.push({ label: name, value: ext, error: 'import.extension' })
  //       return
  //     } 
  //   }
  //   infos.push(file)
  // })
  // const fileInfos = dropFilesFromList(files)
  // if (fileInfos.length) {
  //   const errors: UnknownRecord[] = []
  //   const validFiles: File[] = []
  //   const { eventTarget } = masher
  //   fileInfos.forEach(fileInfo => {
  //     if (fileInfo instanceof File) validFiles.push(fileInfo)
  //     else errors.push(fileInfo)
  //   })
  //   if (errors.length) {
  //     errors.forEach(error => {
  //       const id = idGenerate('activity-error')
  //       const info = { id, type: ActivityType.Error, ...error }
  //       eventTarget.emit(EventType.Active, info)
  //     })
  //   }
  //   if (validFiles.length) return masher.addFiles(validFiles, editorIndex)
  // } else console.log('MasherApp.dropFiles no info')
  // return Promise.resolve([])
  // throw new Error('Method not implemented.')
  get(params: ClientReadParams): Promise<MediaDataOrError> {
    const { localClientArgs: clientArgs } = this
    const { read } = clientArgs
    if (!read)
      return errorPromise(ErrorName.ClientDisabledGet)

    const { getRequest } = read
    if (!getRequest)
      return errorPromise(ErrorName.ClientDisabledGet)

    requestPopulate(getRequest, params)
    return requestRecordPromise(getRequest).then(orError => {
      if (isDefiniteError(orError))
        return orError

      const { data } = orError
      if (!isMediaObject(data))
        return error(ErrorName.Url)
      const media = mediaDefinition(data)
      return { data: media }
    })
  }

  list(params: ClientReadParams): Promise<MediaDataArrayOrError> {
    const { localClientArgs: clientArgs } = this
    const { read } = clientArgs
    if (!read)
      return errorPromise(ErrorName.ClientDisabledList)

    const { listRequest } = read
    if (!listRequest)
      return errorPromise(ErrorName.ClientDisabledList)

    requestPopulate(listRequest, params)
    return requestRecordsPromise(listRequest).then(orError => {
      if (isDefiniteError(orError))
        return orError

      const mediaObjects = orError.data.filter(isMediaObject).map(object => {
        assertMediaObject(object)

        return object
      })
      return { data: mediaObjects.map(mediaDefinition) }
    })
  }

  masher(options: MasherOptions = {}): Masher {
    const masherOptions = {
      mashingType: TypeVideo,
      eventTarget: this.eventTarget,
      ...options,
    }
    const { mashingType } = masherOptions
    const plugin = Runtime.plugins[TypeMasher][mashingType]
    if (!plugin)
      errorThrow(mashingType, 'MashingType', 'mashingType')

    return plugin.masher(masherOptions)
  }

  plugin: PluginDataOrErrorFunction

  pluginPromise: PluginDataOrErrorPromiseFunction

  private _localClientArgs?: LocalClientArgs
  private get localClientArgs(): LocalClientArgs {
    return this._localClientArgs ||= localClientArgs(this.options)
  }
}

export const localClientArgs = (options: LocalClientOptions = {}): LocalClientArgs => {
  function clientOperationArgs(operation: ImportOperation, options: LocalClientOptions): ClientImportArgs | false
  function clientOperationArgs(operation: PluginOperation, options: LocalClientOptions): ClientPluginArgs | false
  function clientOperationArgs(operation: ReadOperation, options: LocalClientOptions): ClientReadArgs | false
  function clientOperationArgs(operation: LocalOperation, options: LocalClientOptions): ClientOperationArgs | false {
    const { [operation]: clientOptions = {} } = options
    if (clientOptions === false)
      return clientOptions

    const { [operation]: defaultLocalClientArg } = DefaultLocalClientArgs
    assertObject(defaultLocalClientArg)

    return { ...defaultLocalClientArg, ...clientOptions }
  }
  return {
    [OperationImport]: clientOperationArgs(OperationImport, options),
    [OperationPlugin]: clientOperationArgs(OperationPlugin, options),
    [OperationRead]: clientOperationArgs(OperationRead, options),
  }
}


export const localClientInstance = (args: LocalClientOptions = {}): LocalClient => (
  new LocalClientClass(args)
)
