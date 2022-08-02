import React from "react"
import { assertDefinitionType, assertPopulatedString, assertSelectType, Definition, DefinitionType, DefinitionTypes } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult } from "../../declarations"
import { View } from "../../Utilities/View"
import { BrowserContext, BrowserContextInterface } from "../../Contexts/BrowserContext"
import { useEditor } from "../../Hooks/useEditor"

export interface BrowserProps extends PropsWithChildren {
  sourceId?: string
}

/**
 * @parents Masher
 * @children BrowserContent
 */
export function Browser(props: BrowserProps): ReactResult {
  const { sourceId: initialSourceId, ...rest } = props
  const [ definitions, setDefinitions] = React.useState<Definition[] | undefined>(undefined)
  const [ definitionId, setDefinitionId] = React.useState('')
  const [ sourceId, setSourceId] = React.useState(initialSourceId || 'text')

  const editor = useEditor()

  const [selectedTypes, setSelectedTypes] = React.useState<DefinitionType[]>(() => DefinitionTypes)
  
  const changeType = (type: string) => {
    assertPopulatedString(type)
    
    const types = type.split(',')
    types.every(type => assertDefinitionType(type))
    const selectTypes = types as DefinitionType[]
    // console.log("Inspector changeType", ...selectTypes)
    setSelectedTypes(selectTypes)
  }
  const browserContext: BrowserContextInterface = {
    definitions,
    definitionId,
    setDefinitions,
    setDefinitionId,
    setSourceId,
    sourceId,
    changeType, 
    selectedTypes,
  }

  return (
    <BrowserContext.Provider value={browserContext}>
      <View {...rest} />
    </BrowserContext.Provider>
  )
}
