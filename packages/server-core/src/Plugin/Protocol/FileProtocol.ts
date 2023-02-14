import { 
  assertTrue, Request, MediaType, ProtocolPromise, Plugins, ProtocolFile 
} from "@moviemasher/moviemasher.js"

const promise = ((request: Request, type?: MediaType) => {
  assertTrue(!type)
  return Promise.resolve({})
}) as ProtocolPromise

Plugins.protocols.file = { promise, type: ProtocolFile }
