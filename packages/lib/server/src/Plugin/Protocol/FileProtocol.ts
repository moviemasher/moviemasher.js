import { 
   ProtocolPromise, ProtocolFile, assertEndpoint, 
  assertPopulatedString, TypeProtocol, Runtime 
} from "@moviemasher/lib-shared"
import { errorPromise, LoadType, EndpointRequest, ErrorName } from "@moviemasher/runtime-shared"

const promise: ProtocolPromise = (request: EndpointRequest, type?: LoadType) => {
  if (type) return errorPromise(ErrorName.Type)
  
  const { endpoint } = request
  assertEndpoint(endpoint)
  const { pathname: data } = endpoint
  assertPopulatedString(data)

  return Promise.resolve({ data })
}

Runtime.plugins[TypeProtocol][ProtocolFile] ||= { 
  promise, type: TypeProtocol, protocol: ProtocolFile 
}
