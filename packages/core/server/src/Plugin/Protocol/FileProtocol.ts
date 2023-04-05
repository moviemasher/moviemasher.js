import { 
  Request, ProtocolPromise, ProtocolFile, LoadType, errorPromise, assertEndpoint, 
  ErrorName, assertPopulatedString, TypeProtocol, Runtime 
} from "@moviemasher/lib-core"

const promise: ProtocolPromise = (request: Request, type?: LoadType) => {
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
