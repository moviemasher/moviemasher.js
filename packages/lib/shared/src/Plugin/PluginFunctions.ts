import type {DecodePlugin} from './Decode/Decode.js'
import type {EncodePlugin} from './Encode/Encode.js'
import type {MasherPlugin} from './Masher/Masher.js'
import type {Plugin, PluginDataOrError, PluginType, DecodeType, EncodeType, MasherType, ProtocolType, TranscodeType} from '@moviemasher/runtime-shared'
import type {ProtocolPlugin} from './Protocol/Protocol.js'
import type {EndpointRequest} from '@moviemasher/runtime-shared'
import type {TranscodePlugin} from './Transcode/Transcode.js'

import {DefaultRequest} from '../Helpers/Request/RequestConstants.js'
import {error, errorPromise, errorThrow} from '@moviemasher/runtime-shared'
import {ErrorName} from '@moviemasher/runtime-shared'
import {isDefiniteError} from '../Shared/SharedGuards.js'
import { isBoolean, isObject, isPopulatedString } from "@moviemasher/runtime-shared"
import { Runtime } from '../Runtime/Runtime.js'

export const isPlugin = (value: any): value is Plugin => {
  return isObject(value) && 'type' in value && isPopulatedString(value.type)
}
export function assertPlugin(value: any, name?: string): asserts value is Plugin {
  if (!isPlugin(value)) errorThrow(value, 'Plugin', name)
}

const pluginId = (id: string) => id.replace(/[^a-z]/g, '')

export const pluginOrVoid = (pluginType: PluginType, id: string): Plugin | void => {
  const plugin = Runtime.plugins[pluginType][pluginId(id)]
  if (plugin) return plugin
}

export function pluginDataOrErrorPromise(id: string, pluginType: DecodeType): Promise<PluginDataOrError<DecodePlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: EncodeType): Promise<PluginDataOrError<EncodePlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: MasherType): Promise<PluginDataOrError<MasherPlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: ProtocolType): Promise<PluginDataOrError<ProtocolPlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: TranscodeType): Promise<PluginDataOrError<TranscodePlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: PluginType): Promise<PluginDataOrError> 
export function pluginDataOrErrorPromise(id: string, pluginType: PluginType): Promise<PluginDataOrError> {
  const plugin = pluginOrVoid(pluginType, id)
  // console.log('pluginDataOrErrorPromise', id, pluginType, plugin)
  if (plugin) return Promise.resolve({ data: plugin })

  if (isBoolean(plugin)) return errorPromise(ErrorName.Type)

  const safeId = pluginId(id)


  // const importRequest = pluginRequest()
  // const { endpoint } = importRequest
  // assertEndpoint(endpoint)

  // const url = endpointUrl(endpoint)
  // const resolved = urlResolve(url, `${pluginType}-${safeId}`)
  const resolved = `@moviemasher/${pluginType}-${safeId}`


  return import(resolved).then(() => {
    const plugin = pluginOrVoid(pluginType, safeId)
    if (plugin) return { data: plugin }

    Runtime.plugins[pluginType][pluginId(id)] = false
    return error(ErrorName.Type, { value: id })
    
  }).catch((error) => errorPromise(ErrorName.Type, error))
}
export type PluginDataOrErrorPromiseFunction = typeof pluginDataOrErrorPromise


export const plugin = (id: string, pluginType: PluginType): Plugin => {
  const plugin = pluginOrVoid(pluginType, id)
  assertPlugin(plugin, id)
  
  return plugin
}

export function pluginPromise(id: string, pluginType: PluginType): Promise<Plugin> {
  return pluginDataOrErrorPromise(id, pluginType).then(orError => {
    if (isDefiniteError(orError)) return errorThrow(orError)
  
    return orError.data
  })
}

export function pluginDataOrError(id: string, pluginType: DecodeType): PluginDataOrError<DecodePlugin>
export function pluginDataOrError(id: string, pluginType: EncodeType): PluginDataOrError<EncodePlugin>
export function pluginDataOrError(id: string, pluginType: MasherType): PluginDataOrError<MasherPlugin>
export function pluginDataOrError(id: string, pluginType: ProtocolType): PluginDataOrError<ProtocolPlugin>
export function pluginDataOrError(id: string, pluginType: TranscodeType): PluginDataOrError<TranscodePlugin>
export function pluginDataOrError(id: string, pluginType: PluginType): PluginDataOrError 
export function pluginDataOrError(id: string, pluginType: PluginType): PluginDataOrError {
  const data = pluginOrVoid(pluginType, id)
  return data ? { data } : error(ErrorName.Type, { value: id })
}
export type PluginDataOrErrorFunction = typeof pluginDataOrError

let _pluginRequest: EndpointRequest = DefaultRequest

export const pluginRequest = (request?: EndpointRequest): EndpointRequest => {
  // console.log('pluginRequest', request, _pluginRequest)
  if (request) _pluginRequest = request
  return _pluginRequest
}
