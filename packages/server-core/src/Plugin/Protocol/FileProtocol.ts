import { 
  Request, ProtocolPromise, FileProtocol, LoadType, errorPromise, assertEndpoint, 
  ErrorName, assertPopulatedString, ProtocolType, Runtime 
} from "@moviemasher/moviemasher.js"

const promise: ProtocolPromise = (request: Request, type?: LoadType) => {
  if (type) return errorPromise(ErrorName.Type)
  
  const { endpoint } = request
  assertEndpoint(endpoint)
  const { pathname: data } = endpoint
  assertPopulatedString(data)

  return Promise.resolve({ data })
  
}

Runtime.plugins[ProtocolType][FileProtocol] ||= { 
  promise, type: ProtocolType, protocol: FileProtocol 
}
