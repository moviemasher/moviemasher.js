import type {DecodePlugin} from './Decode/Decode.js'
import type {EncodePlugin} from './Encode/Encode.js'
import type {FilterPlugin} from './Filter/Filter.js'
import type {MasherPlugin} from './Masher/Masher.js'
import type {Plugin, PluginDataOrError, PluginType, DecodeType, EncodeType, FilterType, MasherType, ProtocolType, ResolveType, ThemeType, TranscodeType} from './Plugin.js'
import type {ProtocolPlugin} from './Protocol/Protocol.js'
import type {Request} from '../Helpers/Request/Request.js'
import type {ResolvePlugin} from './Resolve/Resolve.js'
import type {ThemePlugin} from './Theme/Theme.js'
import type {TranscodePlugin} from './Transcode/Transcode.js'

import {DefaultRequest} from '../Helpers/Request/RequestConstants.js'
import {endpointUrl, assertEndpoint, urlResolve} from '../Helpers/Endpoint/EndpointFunctions.js'
import {error, errorPromise, errorThrow} from '../Helpers/Error/ErrorFunctions.js'
import {ErrorName} from '../Helpers/Error/ErrorName.js'
import {isBoolean, isDefiniteError, isObject, isPopulatedString} from '../Utility/Is.js'
import {Runtime} from '../Runtime/Runtime.js'

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
export function pluginDataOrErrorPromise(id: string, pluginType: FilterType): Promise<PluginDataOrError<FilterPlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: MasherType): Promise<PluginDataOrError<MasherPlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: ProtocolType): Promise<PluginDataOrError<ProtocolPlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: ResolveType): Promise<PluginDataOrError<ResolvePlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: TranscodeType): Promise<PluginDataOrError<TranscodePlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: ThemeType): Promise<PluginDataOrError<ThemePlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: PluginType): Promise<PluginDataOrError> 
export function pluginDataOrErrorPromise(id: string, pluginType: PluginType): Promise<PluginDataOrError> {
  const plugin = pluginOrVoid(pluginType, id)
  // console.log('pluginDataOrErrorPromise', id, pluginType, plugin)
  if (plugin) return Promise.resolve({ data: plugin })

  if (isBoolean(plugin)) return errorPromise(ErrorName.Type)

  const safeId = pluginId(id)
  const importRequest = pluginRequest()
  const { endpoint } = importRequest
  assertEndpoint(endpoint)

  const url = endpointUrl(endpoint)
  const resolved = urlResolve(url, `${pluginType}-${safeId}`)
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
export function pluginDataOrError(id: string, pluginType: FilterType): PluginDataOrError<FilterPlugin>
export function pluginDataOrError(id: string, pluginType: MasherType): PluginDataOrError<MasherPlugin>
export function pluginDataOrError(id: string, pluginType: ProtocolType): PluginDataOrError<ProtocolPlugin>
export function pluginDataOrError(id: string, pluginType: ResolveType): PluginDataOrError<ResolvePlugin>
export function pluginDataOrError(id: string, pluginType: TranscodeType): PluginDataOrError<TranscodePlugin>
export function pluginDataOrError(id: string, pluginType: ThemeType): PluginDataOrError<ThemePlugin>
export function pluginDataOrError(id: string, pluginType: PluginType): PluginDataOrError 
export function pluginDataOrError(id: string, pluginType: PluginType): PluginDataOrError {
  const data = pluginOrVoid(pluginType, id)
  return data ? { data } : error(ErrorName.Type, { value: id })
}
export type PluginDataOrErrorFunction = typeof pluginDataOrError

let _pluginRequest: Request = DefaultRequest

export const pluginRequest = (request?: Request): Request => {
  // console.log('pluginRequest', request, _pluginRequest)
  if (request) _pluginRequest = request
  return _pluginRequest
}

// export const decodePlugin = pluginDataOrError('', DecodeType)
// if (!isDefiniteError(decodePlugin)) { decodePlugin.data.type } 
// export const protocolPlugin = pluginDataOrError('', ProtocolType)
// if (!isDefiniteError(protocolPlugin)) { protocolPlugin.data.type } 



