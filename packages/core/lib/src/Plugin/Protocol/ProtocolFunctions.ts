import { ProtocolType } from "../Plugin"
import { pluginDataOrErrorPromise } from "../PluginFunctions"
import { ProtocolPlugin } from "./Protocol"
import { isDefiniteError } from "../../Utility/Is"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"

export const protocolLoadPromise = (protocol: string): Promise<ProtocolPlugin> => {

  return pluginDataOrErrorPromise(protocol, ProtocolType).then(orError => {
    if (isDefiniteError(orError)) return errorThrow(orError)
  
    return orError.data
  })
}
