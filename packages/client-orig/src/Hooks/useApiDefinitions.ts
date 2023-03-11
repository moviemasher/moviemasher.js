import { 
  MediaArray, MediaTypes, 
} from "@moviemasher/moviemasher.js"
import { 
  ReadOperation 
} from "@moviemasher/client-core"

import { useClient } from "./useClient"

// const ApiDefinitionsEvent = 'api-definitions'
// const ApiDefinitionsDisabled = 'disabled'
// const ApiDefinitionsEmpty = 'empty'

export const useApiDefinitions = (types: MediaTypes = []): MediaArray => {

  const client = useClient()
  if (!client.enabled(ReadOperation)) return []

  
  // const storeRef = React.useRef<Record<string, MediaArray>>({})

  // const { eventTarget } = editor

  // const definitionsPromise = (key: string) => {

  //   const options: ClientReadOptions = { type: types }
  //   return client.list(options).then((response: MediaDataArrayOrError) => {
  //     console.debug("DataDefinitionRetrieveResponse", Endpoints.data.definition.retrieve, response)
  //     const { error, data } = response
  //     if (!data) return
  //     const array = storeRef.current[key]
  //     array.push(...data)
  //     eventTarget.dispatchEvent(new CustomEvent(ApiDefinitionsEvent))
  //   })
  // }
  
  // const snapshotInitialize = (key: string): MediaArray => {
  //   switch(key) {
  //     case ApiDefinitionsEmpty:
  //     case ApiDefinitionsDisabled: break
  //     default: definitionsPromise(key) 
  //   }
  //   return []
  // }

  // const currentKey = () => {
  //   if (!types.length) return ApiDefinitionsEmpty

  //   return types.join('-')
  // }

  // const snapshotGet = () => {
  //   const key = currentKey()
  //   const array = storeRef.current[key]
  //   if (array) return array
    
  //   // console.log("useApiDefinitions defining", key)
  //   return storeRef.current[key] = snapshotInitialize(key)
  // }

  const externalStore: MediaArray = []
  // React.useSyncExternalStore<MediaArray>((callback) => {
  //   eventTarget.addEventListener(ApiDefinitionsEvent, callback)
  //   return () => {
  //     eventTarget.removeEventListener(ApiDefinitionsEvent, callback)
  //   }
  // }, snapshotGet)
  
  return externalStore
}