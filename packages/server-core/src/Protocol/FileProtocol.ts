import { assertTrue, RequestObject, DefinitionType, ProtocolPromise, Protocols } from "@moviemasher/moviemasher.js"

const promise = ((request: RequestObject, type?: DefinitionType) => {
  assertTrue(!type)
  return Promise.resolve({})
}) as ProtocolPromise

Protocols.file = { promise }
