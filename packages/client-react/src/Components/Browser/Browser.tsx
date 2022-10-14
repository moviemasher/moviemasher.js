import React from "react"
import { 
  assertPopulatedString, DefinitionType, DefinitionTypesObject
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult } from "../../declarations"
import { View } from "../../Utilities/View"
import { BrowserContext, BrowserContextInterface } from "./BrowserContext"
import { MasherContext } from "../Masher/MasherContext"
import { useDefinitions } from "../../Hooks/useDefinitions"


export interface BrowserProps extends PropsWithChildren {
  initialPicked?: string
}

/**
 * @parents Masher
 * @children BrowserContent, BrowserPicker
 */
export function Browser(props: BrowserProps): ReactResult {
  const { initialPicked = 'container', ...rest } = props

  const [typesObject, setTypesObject] = React.useState<DefinitionTypesObject>({})
  const editorContext = React.useContext(MasherContext)
  const { changeDefinition } = editorContext
  const [ picked, setPicked] = React.useState(initialPicked) 
  
  const pick = (id: string) => {
    assertPopulatedString(id)
    changeDefinition()
    setPicked(id)
  }

  const [_, definitions] = useDefinitions(typesObject[picked])

  const addPicker = (id: string, types: DefinitionType[]) => {
    setTypesObject(original => ({ ...original, [id]: types }))
  }

  const removePicker = (id: string): void => {
    setTypesObject(original => ({ ...original, [id]: [] }))
  }

  const browserContext: BrowserContextInterface = {
    definitions,
    picked,
    pick, 
    addPicker, 
    removePicker,
  }

  const contextProps = {
    value: browserContext,
    children: <View {...rest} />
  }
  return (
    <BrowserContext.Provider { ...contextProps } />
  )
}
