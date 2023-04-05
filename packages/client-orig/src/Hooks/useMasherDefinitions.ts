import React from "react"
import { 
  assertDefined, MediaArray, MediaTypes
} from "@moviemasher/lib-core"

import MasherContext from "../Components/Masher/MasherContext"


export const useEditorDefinitions = (types: MediaTypes = []): MediaArray => {
  const masherContext = React.useContext(MasherContext)
  const { masher: editor } = masherContext
  assertDefined(editor)

  // const { media } = editor

  // const storeRef = React.useRef<Record<string, MediaArray>>({})
  // const { eventTarget } = editor
  
  // const snapshotInitialize = (): MediaArray => {
  //   const lists = types.map(type => media.byType(type))
  //   return lists.length === 1 ? lists[0] : lists.flat()
  // }

  // const snapshotGet = () => {
  //   const key = types.join('-') || 'empty'
  //   return storeRef.current[key] ||= snapshotInitialize()
  // }

  // const handleEvent = (event: Event) => {
  //   const { type } = event
  //   if (isEventType(type) && (event instanceof CustomEvent)) {
  //     const { detail } = event
  //     const { definitionTypes } = detail
  //     if (isPopulatedArray(definitionTypes)) {
  //       const types = definitionTypes as MediaType[]

  //       const { current} = storeRef
  //       const allIds = Object.keys(current)
  //       const ids = allIds.filter(id => types.some(type => id.includes(type)))
  //       ids.forEach(id => delete current[id])
  //     }
  //   }
  // }
  const externalStore: MediaArray = []
  
  // React.useSyncExternalStore<MediaArray>((callback) => {
  //   eventTarget.addEventListener(EventType.Added, callback)
  //   eventTarget.addEventListener(EventType.Resize, callback)
  //   return () => {
  //     eventTarget.removeEventListener(EventType.Added, callback)
  //     eventTarget.removeEventListener(EventType.Resize, callback)
  //   }
  // }, snapshotGet)

  // const removeListener = () => {
  //   eventTarget.removeEventListener(EventType.Added, handleEvent)
  // }

  // const addListener = () => {
  //   eventTarget.addEventListener(EventType.Added, handleEvent)
  //   return () => { removeListener() }
  // }

  // React.useEffect(() => addListener(), [])
  
  return externalStore
}