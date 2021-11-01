import React from "react"
import { Definition, UnknownObject } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"
import { BrowserContext, BrowserContextInterface } from "./BrowserContext"

interface BrowserProps extends UnknownObject {
  sourceId?: string
  children: React.ReactNode
}

const Browser: React.FunctionComponent<BrowserProps> = props => {
  const { sourceId: initialSourceId, ...rest } = props
  const [ definitions, setDefinitions] = React.useState<Definition[] | undefined>(undefined)
  const [ definitionId, setDefinitionId] = React.useState('')
  const [ sourceId, setSourceId] = React.useState('')

  const browserContext: BrowserContextInterface = {
    definitions,
    definitionId,
    setDefinitions,
    setDefinitionId,
    setSourceId,
    sourceId,
  }

  React.useEffect(() => {
    setDefinitions(undefined)
    setSourceId(initialSourceId || 'theme')
  }, [initialSourceId])

  return (
    <BrowserContext.Provider value={browserContext}>
      <View {...rest} />
    </BrowserContext.Provider>
  )
}

export { Browser }
