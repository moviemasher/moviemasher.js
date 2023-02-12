import { 
  assertTrue, RequestObject, MediaType, ProtocolPromise, Plugins, ProtocolFile 
} from "@moviemasher/moviemasher.js"

const promise = ((request: RequestObject, type?: MediaType) => {
  assertTrue(!type)
  return Promise.resolve({})
}) as ProtocolPromise

Plugins.protocols.file = { promise, type: ProtocolFile }
