import type {
  MediaType, StringRecord, Strings, Masher, Request,
  MasherOptions, MediaDataArrayOrError,
  MediaTypes, PluginDataOrErrorFunction,
  PluginDataOrErrorPromiseFunction, Emitter, MediaDataOrError, 
  UploadType, NestedStringRecord, TranslateArgs
} from '@moviemasher/lib-core'
import type { Icon, Translation } from '../declarations.js'


import {
  TypeAudio, TypeEffect, TypeFont, TypeImage, TypeMash, TypeVideo,
} from '@moviemasher/lib-core'
import {
    Endpoints,
  } from '@moviemasher/lib-core'

export interface LocalClient {
  readonly args: LocalClientArgs
  /**
   *
   * @returns appropriate accept attribute for file input element
   */
  fileAccept: string
  fileMedia(file: File): Promise<MediaDataOrError>
  eventTarget: Emitter
  enabled(operation?: LocalOperation | LocalOperations): boolean

  iconPromise(args: TranslateArgs): Promise<Icon>
  translationPromise(args: TranslateArgs): Promise<Translation>
  
  masher(options?: MasherOptions): Masher
  plugin: PluginDataOrErrorFunction
  pluginPromise: PluginDataOrErrorPromiseFunction

  get(options?: ClientReadParams): Promise<MediaDataOrError>
  list(options?: ClientReadParams): Promise<MediaDataArrayOrError>
}



export const DefaultClientLimits: ClientLimits = {
  [TypeAudio]: 50,
  [TypeEffect]: 1,
  [TypeFont]: 10,
  [TypeImage]: 20,
  [TypeMash]: 5,
  [TypeVideo]: 100,
}
export const DefaultClientImportArgs: ClientImportArgs = {
  uploadLimits: DefaultClientLimits,
}

export const DefaultClientPluginArgs: ClientPluginArgs = {
  request: { endpoint: {} },
}

export const OperationImport: ImportOperation = 'import'
export const OperationPlugin: PluginOperation = 'plugin'
export const OperationRead: ReadOperation = 'read'

export const OperationsLocal: LocalOperations = [
  OperationImport,
  OperationPlugin,
  OperationRead,
]

export const isLocalOperation = (value: any): value is LocalOperation => {
  return OperationsLocal.includes(value)
}


export const DefaultClientReadArgs: ClientReadArgs = {
  paramPosition: 'search',
  getRequest: { endpoint: { pathname: Endpoints.data.definition.get } },
  listRequest: { endpoint: { pathname: Endpoints.data.definition.retrieve } },
}

export const DefaultLocalClientArgs: LocalClientArgs = {
  translationSource: '',
  iconSource: '',
  [OperationImport]: DefaultClientImportArgs,
  [OperationPlugin]: DefaultClientPluginArgs,
  [OperationRead]: DefaultClientReadArgs,
}


export const LocalClientDisabledArgs: LocalClientArgs = {
  ...DefaultLocalClientArgs,
  [OperationRead]: false,
}

export interface ClientOperationOptions { }

export interface ClientOperationArgs { }

export type ImportOperation = 'import'
export type PluginOperation = 'plugin'
export type ReadOperation = 'read'

export type LocalOperation = ImportOperation | PluginOperation | ReadOperation
export type LocalOperations = LocalOperation[]

export type ParamPosition = 'search' | 'body' | 'params'

export interface LocalClientOptions {
  translationSource?: string | NestedStringRecord
  iconSource?: string | NestedStringRecord
   
  [OperationPlugin]?: ClientPluginOptions | false | undefined
  [OperationImport]?: ClientImportOptions | false | undefined
  [OperationRead]?: ClientReadOptions | false | undefined
}

export interface LocalClientArgs {
  translationSource: string | NestedStringRecord
  iconSource: string | NestedStringRecord
  [OperationPlugin]: ClientPluginOptions | false
  [OperationImport]: ClientImportArgs | false
  [OperationRead]: ClientReadArgs | false
}

export type ClientLimits = {
  [index in UploadType]?: number
}

export interface ClientImportOptions extends ClientOperationOptions {
  uploadLimits?: ClientLimits | false
}

export interface ClientImportArgs extends ClientOperationArgs, Required<ClientImportOptions> { }

export interface ClientPluginOptions extends ClientOperationOptions {
  request?: Request | false
}
export interface ClientPluginArgs extends ClientOperationArgs, Required<ClientPluginOptions> { }

export interface ClientReadOptions extends ClientOperationOptions {
  paramPosition: ParamPosition
  getRequest?: Request | false
  listRequest?: Request | false
}

export interface ClientReadArgs extends ClientOperationArgs, Required<ClientReadOptions> { }


export interface ClientReadParams {
  type?: MediaType | MediaTypes
  kind?: string | Strings
  order?: string | StringRecord
  offset?: number
  index?: number
  count?: number
}
