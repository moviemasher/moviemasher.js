import { 
  Request, ProtocolPromise, Plugins, FileProtocol, LoadType, errorPromise, 
  ErrorName, PathData, assertPopulatedString, ProtocolType, assertEndpoint 
} from "@moviemasher/moviemasher.js"

const promise: ProtocolPromise = (request: Request, type?: LoadType) => {
  if (type) return errorPromise(ErrorName.Type)
  
  const { endpoint } = request
  assertEndpoint(endpoint)
  const { pathname: path } = endpoint
  assertPopulatedString(path)

  const pathData: PathData = { path }
  return Promise.resolve(pathData)
  
}

Plugins[ProtocolType][FileProtocol] = { promise, type: FileProtocol }
