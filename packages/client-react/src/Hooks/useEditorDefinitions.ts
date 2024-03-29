import React from "react"
import { 
  assertDefined, EventType, isEventType,  Editor, Definitions, 
  DefinitionType, Defined, isPopulatedArray 
} from "@moviemasher/moviemasher.js"

import { MasherContext } from "../Components/Masher/MasherContext"

const EditorDefinitionsEventAdded = EventType.Added
const EditorDefinitionsEventResize = EventType.Resize
export const useEditorDefinitions = (types: DefinitionType[] = []): [Editor, Definitions] => {
  const masherContext = React.useContext(MasherContext)
  const { editor } = masherContext
  assertDefined(editor)

  const storeRef = React.useRef<Record<string, Definitions>>({})
  const { eventTarget } = editor
  
  const snapshotInitialize = (): Definitions => {
    const lists = types.map(type => Defined.byType(type))
    return lists.length === 1 ? lists[0] : lists.flat()
  }

  const snapshotGet = () => {
    const key = types.join('-') || 'empty'
    return storeRef.current[key] ||= snapshotInitialize()
  }

  const handleEvent = (event: Event) => {
    const { type } = event
    if (isEventType(type) && (event instanceof CustomEvent)) {
      const { detail } = event
      const { definitionTypes } = detail
      if (isPopulatedArray(definitionTypes)) {
        const types = definitionTypes as DefinitionType[]

        const { current} = storeRef
        const allIds = Object.keys(current)
        const ids = allIds.filter(id => types.some(type => id.includes(type)))
        ids.forEach(id => delete current[id])
      }
    }
  }
  const externalStore = React.useSyncExternalStore<Definitions>((callback) => {
    eventTarget.addEventListener(EditorDefinitionsEventAdded, callback)
    eventTarget.addEventListener(EditorDefinitionsEventResize, callback)
    return () => {
      eventTarget.removeEventListener(EditorDefinitionsEventAdded, callback)
      eventTarget.removeEventListener(EditorDefinitionsEventResize, callback)
    }
  }, snapshotGet)

  const removeListener = () => {
    eventTarget.removeEventListener(EditorDefinitionsEventAdded, handleEvent)
  }

  const addListener = () => {
    eventTarget.addEventListener(EditorDefinitionsEventAdded, handleEvent)
    return () => { removeListener() }
  }

  React.useEffect(() => addListener(), [])
  
  return [editor, externalStore]
}