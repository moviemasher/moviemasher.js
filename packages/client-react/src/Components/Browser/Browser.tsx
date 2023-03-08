import React from "react"
import { 
  assertPopulatedString, MediaType, MediaTypesRecord
} from '@moviemasher/moviemasher.js'


import { PropsWithChildren } from "../../Types/Props"
import { View } from "../../Utilities/View"
import { BrowserContext, BrowserContextInterface } from "./BrowserContext"
import MasherContext  from "../Masher/MasherContext"
import { useDefinitions } from "../../Hooks/useDefinitions"
import { useRefresh } from "../../Hooks/useRefresh"


export interface BrowserProps extends PropsWithChildren {
  initialPicked?: string
}


export function Browser(props: BrowserProps) {
  const { initialPicked = 'container', ...rest } = props

  const [typesObject, setTypesObject] = React.useState<MediaTypesRecord>({})
  const masherContext = React.useContext(MasherContext)
  const { changeDefinition } = masherContext
  const [refresh] = useRefresh()
  const [ picked, setPicked] = React.useState(initialPicked) 
  const pick = (id: string) => {
    assertPopulatedString(id)
    changeDefinition()
    setPicked(id)
  }

  const definitions = useDefinitions(typesObject[picked])

  const addPicker = (id: string, types: MediaType[]) => {
    setTypesObject(original => ({ ...original, [id]: types }))
  }

  const removePicker = (id: string): void => {
    setTypesObject(original => ({ ...original, [id]: [] }))
  }

  const browserContext: BrowserContextInterface = {
    refresh,
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
