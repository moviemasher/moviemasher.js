import type {
  UploadType, 
  MediaDataArrayOrError,
  Masher, MediaDataOrError, MasherOptions, 
  PluginDataOrErrorPromiseFunction, PluginDataOrErrorFunction, 
  TranslateArgs,
} from '@moviemasher/lib-core'
import type { 
  ClientLimits, ClientReadParams, LocalClient, LocalClientOptions, 
  ClientImportArgs, 
  ClientOperationArgs, ClientPluginArgs, ClientReadArgs, 
  ImportOperation, LocalClientArgs, LocalOperation, PluginOperation, 
  ReadOperation, LocalOperations 
} from './LocalClient.js'
import type { Icon, Translation } from '../declarations.js'

import {
  isTyped, mediaTypeFromMime,
  isAssetObject,
  mediaDefinition,
  requestRecordsPromise,
  assertAssetObject,
  Emitter,
  Runtime,
  TypeMasher,
  errorThrow,
  JsonMimetype, requestPopulate, requestRecordPromise, 
  ErrorName, error, AsteriskChar, CommaChar, errorPromise, isDefiniteError,
  isAboveZero, SlashChar, pluginDataOrError,
  pluginDataOrErrorPromise, assertObject, isPopulatedString,
  isNestedStringRecord, DotChar,
  endpointFromUrl,
  isStringRecord,
  isUploadType
} from '@moviemasher/lib-core'
import { 
  DefaultLocalClientArgs, OperationRead, OperationsLocal, isLocalOperation, 
  OperationImport, OperationPlugin 
} from './LocalClient.js'
import { fileMediaObjectPromise } from '../../client-deleted/File.js'

import '../Protocol/Http.js'
import '../Protocol/Blob.js'
import { 
  TypeVideo, TypesAsset, isAssetType,
  NestedStringRecord,
  DataOrError, PotentialError,
  Strings, 
} from '@moviemasher/runtime-shared'

export class LocalClientClass implements LocalClient {
  constructor(public options?: LocalClientOptions) {
    this.plugin = pluginDataOrError
    this.pluginPromise = pluginDataOrErrorPromise

  }

  get args(): LocalClientArgs { return this.localClientArgs }

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
    TypesAsset.forEach(type => {
      const limit = uploadLimits[type]
      if (isAboveZero(limit))
        accept.push(`${type}${SlashChar}${AsteriskChar}`)
    })
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
        if (!isUploadType(type))
          return error(ErrorName.ImportType, { value: type })

        return this.fileSizeError(file, uploadLimits, type)
      })
    }
    const coreType = mediaTypeFromMime(mimetype)

    if (!isAssetType(coreType))
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
  //       const info = { id, type: ActivityTypeError, ...error }
  //       eventTarget.emit(EventTypeActive, info)
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
      if (!isAssetObject(data))
        return error(ErrorName.Url)
      const media = mediaDefinition(data)
      return { data: media }
    })
  }

  private iconRecordPromise(): Promise<DataOrError<NestedStringRecord>> {
    const { iconRecord } = this
    if (iconRecord) return Promise.resolve(iconRecord)
    
    const { iconSource } = this.args
    if (isNestedStringRecord(iconSource)) {
      this.iconRecord = { data: iconSource }
      return Promise.resolve(this.iconRecord)
    }

    const request = { endpoint: endpointFromUrl(iconSource), init: { method: 'GET' } }
    return requestRecordPromise(request).then(orError => {
      if (isDefiniteError(orError)) {
        this.iconRecord = orError
        return orError
      }
      this.iconRecord = { data: orError as NestedStringRecord }
      return this.iconRecord 
    })
  }
  
  private iconRecord?: DataOrError<NestedStringRecord> 

  private iconLookup(args: TranslateArgs): string {
    const { iconRecord } = this
    const { id, locale } = args

    if (!iconRecord || isDefiniteError(iconRecord)) return ''

    const { data } = iconRecord
    if (isStringRecord(data)) {
      const string = data[id]
      // console.log('iconLookup isStringRecord', id, string)

      if (string) return string
    } else if (locale && isNestedStringRecord(data)) {
      const record = data[locale] || data
      if (isStringRecord(record)) {
        const string = record[id]
        // console.log('iconLookup isNestedStringRecord', id, string)

        if (string) return string
      }
    }
    return ''
  }


  iconPromise(args: TranslateArgs): Promise<Icon> {
    return this.iconRecordPromise().then(orError => {
      if (isDefiniteError(orError)) return {}

      const string = this.iconLookup(args)
      if (isPopulatedString(string)) {
        if (string[0] === '<') return { svgString: string } 
        if (string.split(DotChar).slice(-1)[0] === 'svg') {
          return { svgUrl: string } 
        }
        return  { imgUrl: string } 
      }
      return {}
    })
  }

  translationPromise(args: TranslateArgs): Promise<Translation> {
    const data: Translation = { string: args.id }
    return Promise.resolve(data)
  }
  

  list(params: ClientReadParams): Promise<MediaDataArrayOrError> {
    const { localClientArgs: clientArgs } = this
    const { read } = clientArgs
    if (!read) return errorPromise(ErrorName.ClientDisabledList)

    const { listRequest, paramPosition } = read
    if (!listRequest) return errorPromise(ErrorName.ClientDisabledList)

    requestPopulate(listRequest, params)
    return requestRecordsPromise(listRequest).then(orError => {
      if (isDefiniteError(orError))
        return orError

      const mediaObjects = orError.data.filter(isAssetObject).map(object => {
        assertAssetObject(object)

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

  const iconSource = options.iconSource || new URL(`../../json/icons.json`, import.meta.url).href
  const translationSource = options.translationSource || new URL(`../../json/translations.json`, import.meta.url).href
  const args = {
    iconSource,
    translationSource,
    [OperationImport]: clientOperationArgs(OperationImport, options),
    [OperationPlugin]: clientOperationArgs(OperationPlugin, options),
    [OperationRead]: clientOperationArgs(OperationRead, options),
  }
  // console.log('localClientArgs', args)
  return args
}


export const localClientInstance = (args: LocalClientOptions = {}): LocalClient => (
  new LocalClientClass(args)
)
