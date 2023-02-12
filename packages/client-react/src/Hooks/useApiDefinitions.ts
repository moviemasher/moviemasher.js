import React from "react"
import { 
  assertDefined, Editor, MediaArray, 
  MediaType, ServerType, DataDefinitionRetrieveRequest, 
  Endpoints, DataDefinitionRetrieveResponse, 
} from "@moviemasher/moviemasher.js"

import { MasherContext } from "../Components/Masher/MasherContext"
import { ApiContext } from "../Components/ApiClient/ApiContext"
import { ClientContext } from "../Contexts/ClientContext"
import { useClient } from "./useClient"

const ApiDefinitionsEvent = 'api-definitions'
const ApiDefinitionsDisabled = 'disabled'
const ApiDefinitionsEmpty = 'empty'


export const useApiDefinitions = (types: MediaType[] = []): [Editor, MediaArray] => {

  const client = useClient()

  const apiContext = React.useContext(ApiContext)
  const masherContext = React.useContext(MasherContext)
  const { enabled, servers, endpointPromise } = apiContext
  const { editor } = masherContext
  assertDefined(editor)
  
  const storeRef = React.useRef<Record<string, MediaArray>>({})

  const { eventTarget } = editor
  const { media } = editor

  const definitionsPromise = (key: string) => {
    const request: DataDefinitionRetrieveRequest = { types }
    console.debug("DataDefinitionRetrieveRequest", Endpoints.data.definition.retrieve, request)
    return endpointPromise(
      Endpoints.data.definition.retrieve, request
    ).then((response: DataDefinitionRetrieveResponse) => {
      console.debug("DataDefinitionRetrieveResponse", Endpoints.data.definition.retrieve, response)
      const { definitions } = response
      const array = storeRef.current[key]
      array.push(...definitions.map(def => media.media(def)))
      eventTarget.dispatchEvent(new CustomEvent(ApiDefinitionsEvent))
    })
  }
  
  const snapshotInitialize = (key: string): MediaArray => {
    switch(key) {
      case ApiDefinitionsEmpty:
      case ApiDefinitionsDisabled: break
      default: definitionsPromise(key) 
    }
    return []
  }

  const currentKey = () => {
    if (!(enabled && servers[ServerType.Data])) return ApiDefinitionsDisabled
    
    if (!types.length) return ApiDefinitionsEmpty

    return types.join('-')
  }

  const snapshotGet = () => {
    const key = currentKey()
    const array = storeRef.current[key]
    if (array) return array
    
    // console.log("useApiDefinitions defining", key)
    return storeRef.current[key] = snapshotInitialize(key)
  }

  const externalStore = React.useSyncExternalStore<MediaArray>((callback) => {
    eventTarget.addEventListener(ApiDefinitionsEvent, callback)
    return () => {
      eventTarget.removeEventListener(ApiDefinitionsEvent, callback)
    }
  }, snapshotGet)
  
  return [editor, externalStore]
}