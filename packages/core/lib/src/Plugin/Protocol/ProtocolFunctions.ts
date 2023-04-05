import type {ProtocolPlugin} from './Protocol.js'

import {TypeProtocol} from '../Plugin.js'
import {pluginDataOrErrorPromise} from '../PluginFunctions.js'
import {isDefiniteError} from '../../Utility/Is.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'

export const protocolLoadPromise = (protocol: string): Promise<ProtocolPlugin> => {

  return pluginDataOrErrorPromise(protocol, TypeProtocol).then(orError => {
    if (isDefiniteError(orError)) return errorThrow(orError)
  
    return orError.data
  })
}
