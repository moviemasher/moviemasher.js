import React from "react"
import { 
  arrayUnique, assertPopulatedArray, assertPopulatedString, 
  DataDefinitionRetrieveRequest, DataDefinitionRetrieveResponse, 
  Defined, Definition, DefinitionBase, DefinitionType, DefinitionTypesObject, 
  Endpoints, EventType, isPopulatedArray, ServerType, isEventType
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult } from "../../declarations"
import { View } from "../../Utilities/View"
import { useListeners } from "../../Hooks/useListeners"
import { BrowserContext, BrowserContextInterface } from "./BrowserContext"
import { ApiContext } from "../ApiClient/ApiContext"


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
  const [ definitions, setDefinitions] = React.useState<Definition[] | undefined>(undefined)
  const [ definitionId, setDefinitionId] = React.useState('')
  const [ picked, setPicked] = React.useState(initialPicked)  

  const { enabled, endpointPromise } = apiContext
  
  const definedDefinitions = (definitionTypes: DefinitionType[]): Definition[] => {
    const lists = definitionTypes.map(type => Defined.byType(type))
    const combined = lists.length === 1 ? lists[0] : lists.flat()
    return combined
  }

  const definitionsPromise = (definitionTypes: DefinitionType[]) => {
    const defined = definedDefinitions(definitionTypes)
    if (!enabled.includes(ServerType.Data)) return Promise.resolve(defined)
    
    const request: DataDefinitionRetrieveRequest = { types: definitionTypes }
    return endpointPromise(
      Endpoints.data.definition.retrieve, request
    ).then((response: DataDefinitionRetrieveResponse) => {
      console.debug("DataDefinitionRetrieveResponse", Endpoints.data.definition.retrieve, response)
      const { definitions } = response
      const combined = [...defined]
      const filtered = definitions.filter(definitionObject => {
        const { id } = definitionObject
        return !definitions.some(definition => definition.id === id)
      })
      combined.push(...filtered.map(def => DefinitionBase.fromObject(def)))
      return arrayUnique(combined) as Definition[]
    })
  }

  const updateDefinitions = async (id: string) => {
    assertPopulatedString(id)
    setDefinitions(await definitionsPromise(typesObject[id] || []))
  }
  
  const pick = (id: string) => {
    assertPopulatedString(id)
    setPicked(id)
    updateDefinitions(id)
  }

  // const handleAdded = React.useCallback(, [typesObject, picked])

  useListeners({ [EventType.Added]: (event: Event) => {
    const { type } = event
    if (isEventType(type) && (event instanceof CustomEvent)) {
      const { detail } = event
      console.log("Browser handleAdded detail", detail)
      const { definitionTypes } = detail
      if (isPopulatedArray(definitionTypes)) {
        const addedTypes = definitionTypes as DefinitionType[]
        const ids = Object.keys(typesObject)
        const selectedIds = ids.filter(id => {
          const types = typesObject[id]
          assertPopulatedArray(types)

          return types.some(type => addedTypes.includes(type))
        })
        if (!isPopulatedArray(selectedIds)) {
          console.log("Browser handleAdded no selectedIds", ids, typesObject)
          return
        }

        const selectedId = selectedIds.includes(picked) ? picked : selectedIds.shift()
        
        console.log("Browser handleAdded selectedId", picked, selectedId, selectedIds)
          
        assertPopulatedString(selectedId)
        pick(selectedId)
      }
    }
  }
 })

  const addPicker = async (id: string, types: DefinitionType[]): Promise<void> => {
    setTypesObject(original => {
      original[id] = types
      return original
    })
    if (id === picked) setDefinitions(await definitionsPromise(types))
  }

  const removePicker = (id: string): void => {
    setTypesObject(original => { 
      delete original[id]
      return original
    })
  }
  const changeDefinitionId = (id: string) => { setDefinitionId(id) }

  const browserContext: BrowserContextInterface = {
    definitions,
    definitionId,
    changeDefinitionId,
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
