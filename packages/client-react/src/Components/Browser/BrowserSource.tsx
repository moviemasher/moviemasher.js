import React from "react"
import { definitionsByType } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"
import { BrowserContext } from "../../Contexts/BrowserContext"
import { PropsWithChildren, ReactResult } from "../../declarations"
import { propsDefinitionTypes } from "../../Utilities/Props"

interface BrowserSourceProps extends PropsWithChildren {
  id: string
  className?: string
  type?: string
  types?: string | string[]
}

/**
 * @parents Browser
 */
function BrowserSource(props: BrowserSourceProps): ReactResult {
  const browserContext = React.useContext(BrowserContext)

  const { type, types, className, id, ...rest } = props
  const { sourceId, setDefinitions, setSourceId, setDefinitionId } = browserContext

  const classes = []
  if (className) classes.push(className)

  if (sourceId === id) {
    // TODO: get from props or context
    classes.push('selected')
  }

  const onClick = () => {
    // console.log("BrowserSource onClick")
    setDefinitions(undefined)
    setDefinitionId('')
    if (sourceId !== id) setSourceId(id)

    setTimeout(() => {
      const definitionTypes = propsDefinitionTypes(type, types, id)
      const lists = definitionTypes.map(type => definitionsByType(type))
      if (!lists.length) throw "definition type required"

      const definitions = lists.length === 1 ? lists[0] : lists.flat()
      setDefinitions(definitions)
    }, 1)

  }

  React.useEffect(() => {
    // console.log("BrowserSource useEffect", sourceId === id)
    if (sourceId === id) onClick()
  }, [])


  const viewProps = { ...rest, onClick, className: classes.join(' ') }
  return <View {...viewProps}/>
}

export { BrowserSource, BrowserSourceProps }
