import React from "react"
import { 
  arrayUnique, assertPopulatedArray, assertPopulatedString, 
  DataDefinitionRetrieveRequest, DataDefinitionRetrieveResponse, 
  Defined, Definition, DefinitionBase, DefinitionType, DefinitionTypesObject, 
  Endpoints, EventType, isPopulatedArray, ServerType, isEventType, isPopulatedString
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult } from "../../declarations"
import { View } from "../../Utilities/View"
import { useListeners } from "../../Hooks/useListeners"
import { BrowserContext, BrowserContextInterface } from "./BrowserContext"
import { ApiContext } from "../ApiClient/ApiContext"
import { EditorContext } from "../Masher/EditorContext"


export interface BrowserProps extends PropsWithChildren {
  initialPicked?: string
  type?: string
  types?: string | string[]
}

/**
 * @parents Masher
 * @children BrowserContent, BrowserPicker
 */
export function Browser(props: BrowserProps): ReactResult {
  const { initialPicked = 'container', ...rest } = props
  assertPopulatedString(initialPicked)

  const [typesObject, setTypesObject] = React.useState<DefinitionTypesObject>({})

  const apiContext = React.useContext(ApiContext)
  const editorContext = React.useContext(EditorContext)
  const { changeDefinition } = editorContext
  const [ definitions, setDefinitions] = React.useState<Definition[]>([])
  const [ picked, setPicked] = React.useState(initialPicked)  

  const { enabled, servers, endpointPromise } = apiContext
  
  const definedDefinitions = (definitionTypes: DefinitionType[]): Definition[] => {
    const lists = definitionTypes.map(type => Defined.byType(type))
    const combined = lists.length === 1 ? lists[0] : lists.flat()
    return combined
  }

  const definitionsPromise = (definitionTypes: DefinitionType[]) => {
    const defined = definedDefinitions(definitionTypes)
    if (!(enabled && servers[ServerType.Data])) return Promise.resolve(defined)
    
    const request: DataDefinitionRetrieveRequest = { types: definitionTypes }
    return endpointPromise(
      Endpoints.data.definition.retrieve, request
    ).then((response: DataDefinitionRetrieveResponse) => {
      console.debug("DataDefinitionRetrieveResponse", Endpoints.data.definition.retrieve, response)
      const { definitions: definitionObjects } = response
      const filtered = definitionObjects.filter(definitionObject => {
        const { id } = definitionObject
        return !defined.some(definition => definition.id === id)
      })
      return [
        ...defined, 
        ...filtered.map(def => DefinitionBase.fromObject(def))
      ]
    })
  }

  const changeDefinitions = async (types: DefinitionType[]) => {
    changeDefinition()
    setDefinitions(await definitionsPromise(types))
  }
  const updateDefinitions = async (id?: string) => {
    const types = isPopulatedString(id) ? (typesObject[id] || []) : []
    await changeDefinitions(types) 
  }
  
  const pick = async (id: string) => {
    assertPopulatedString(id)
    setPicked(id)
    await updateDefinitions(id)
  }

  useListeners({ 
    [EventType.Added]: async (event: Event) => {
      const { type } = event
      if (isEventType(type) && (event instanceof CustomEvent)) {
        const { detail } = event
        const { definitionTypes } = detail
        if (isPopulatedArray(definitionTypes)) {
          const addedTypes = definitionTypes as DefinitionType[]
          const ids = Object.keys(typesObject)
          const selectedIds = ids.filter(id => {
            const types = typesObject[id]
            assertPopulatedArray(types)

            return types.some(type => addedTypes.includes(type))
          })
          if (!isPopulatedArray(selectedIds)) return

          const selectedId = selectedIds.includes(picked) ? picked : selectedIds.shift()
       
          assertPopulatedString(selectedId)
          await pick(selectedId)
        }
      }
    },
    [EventType.Resize]: () => {
      updateDefinitions().then(() => { updateDefinitions(picked)})
    }
  })

  const addPicker = async (id: string, types: DefinitionType[]): Promise<void> => {
    setTypesObject(original => {
      original[id] = types
      return original
    })
    if (id === picked) await changeDefinitions(types) 
  }

  const removePicker = (id: string): void => {
    setTypesObject(original => { 
      delete original[id]
      return original
    })
  }

  const browserContext: BrowserContextInterface = {
    definitions,
    picked,
    pick, 
    addPicker, 
    removePicker,
  }

  return (
    <BrowserContext.Provider value={browserContext}>
      <View {...rest} />
    </BrowserContext.Provider>
  )
}
