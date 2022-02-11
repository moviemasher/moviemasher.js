import React from "react"
import { Definition } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"
import { BrowserContext, BrowserContextInterface } from "../../Contexts/BrowserContext"
import { PropsWithChildren, ReactResult } from "../../declarations"

interface BrowserProps extends PropsWithChildren {
  sourceId?: string
}

/**
 * @parents Masher
 * @children BrowserContent
 */
function Browser(props: BrowserProps): ReactResult {
  const { sourceId: initialSourceId, ...rest } = props
  const [ definitions, setDefinitions] = React.useState<Definition[] | undefined>(undefined)
  const [ definitionId, setDefinitionId] = React.useState('')
  const [ sourceId, setSourceId] = React.useState('')


  React.useEffect(() => {
    setDefinitions(undefined)
    setSourceId(initialSourceId || 'theme')
  }, [initialSourceId])

  const browserContext: BrowserContextInterface = {
    definitions,
    definitionId,
    setDefinitions,
    setDefinitionId,
    setSourceId,
    sourceId,
  }

  return (
    <BrowserContext.Provider value={browserContext}>
      <View {...rest} />
    </BrowserContext.Provider>
  )
}

export { Browser, BrowserProps }
