import { error, errorPromise, errorThrow } from '../Helpers/Error/ErrorFunctions'
import { ErrorName } from '../Helpers/Error/ErrorName'
import { DefaultRequest } from '../Helpers/Request/RequestConstants'
import { Request } from '../Helpers/Request/Request'
import { DecodeType, EncodeType, FilterType, MasherType, Plugin, PluginDataOrError, PluginType, ProtocolType, ResolveType, TranscodeType, TranslateType } from './Plugin'
import { Runtime } from '../Runtime/Runtime'
import { isBoolean, isDefiniteError, isObject, isPopulatedString } from '../Utility/Is'
import { DecodePlugin } from './Decode/Decode'
import { EncodePlugin } from './Encode/Encode'
import { FilterPlugin } from './Filter/Filter'
import { MasherPlugin } from './Masher/Masher'
import { ProtocolPlugin } from './Protocol/Protocol'
import { TranscodePlugin } from './Transcode/Transcode'
import { TranslatePlugin } from './Translate/Translate'
import { endpointUrl, assertEndpoint, urlResolve } from '../Helpers/Endpoint/EndpointFunctions'
import { ResolvePlugin } from './Resolve/Resolve'


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
export function pluginDataOrErrorPromise(id: string, pluginType: TranslateType): Promise<PluginDataOrError<TranslatePlugin>>
export function pluginDataOrErrorPromise(id: string, pluginType: PluginType): Promise<PluginDataOrError> 
export function pluginDataOrErrorPromise(id: string, pluginType: PluginType): Promise<PluginDataOrError> {
  const plugin = pluginOrVoid(pluginType, id)
  if (plugin) return Promise.resolve({ data:plugin })

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


export const plugin = (pluginType: PluginType, id: string): Plugin => {
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
export function pluginDataOrError(id: string, pluginType: TranslateType): PluginDataOrError<TranslatePlugin>
export function pluginDataOrError(id: string, pluginType: PluginType): PluginDataOrError 
export function pluginDataOrError(id: string, pluginType: PluginType): PluginDataOrError {
  const data = pluginOrVoid(pluginType, id)
  return data ? { data } : error(ErrorName.Type, { value: id })
}
export type PluginDataOrErrorFunction = typeof pluginDataOrError

let _pluginRequest: Request = DefaultRequest

export const pluginRequest = (request?: Request): Request => {
  console.log('pluginRequest', request, _pluginRequest)
  if (request) _pluginRequest = request
  return _pluginRequest
}

// export const decodePlugin = pluginDataOrError('', DecodeType)
// if (!isDefiniteError(decodePlugin)) { decodePlugin.data.type } 
// export const protocolPlugin = pluginDataOrError('', ProtocolType)
// if (!isDefiniteError(protocolPlugin)) { protocolPlugin.data.type } 



