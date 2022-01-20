import React from "react"
import { definitionsByType } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"
import { BrowserContext } from "../../Contexts/BrowserContext"
import { PropsWithChildren, ReactResult, SourceCallback } from "../../declarations"
import { propsDefinitionTypes } from "../../Utilities/Props"

interface BrowserSourceProps extends PropsWithChildren {
  id: string
  className?: string
  promiseProvider?: SourceCallback
  type?: string
  types?: string | string[]
}

/**
 * @parents Browser
 */
function BrowserSource(props: BrowserSourceProps): ReactResult {
  const browserContext = React.useContext(BrowserContext)

  const { type, types, className, id, promiseProvider, ...rest } = props
  const { definitions, sourceId, setDefinitions, setSourceId, setDefinitionId } = browserContext

  const classes = []
  if (className) classes.push(className)

  if (sourceId === id) {
    // TODO: get from props or context
    classes.push('selected')

    if (typeof definitions === 'undefined') {
      if (promiseProvider) {
        promiseProvider().then(definitions => setDefinitions(definitions))
      } else {
        setTimeout(() => {
          const definitionTypes = propsDefinitionTypes(type, types, id)
          const lists = definitionTypes.map(type => definitionsByType(type))
          if (!lists.length) throw "definition type or promiseProvider required"

          const definitions = lists.length === 1 ? lists[0] : lists.flat()
          setDefinitions(definitions)
        }, 1)
      }
    }
  }

  const onClick = () => {
    setDefinitions(undefined)
    setDefinitionId('')
    setSourceId(id)
  }

  const viewProps = {
    ...rest,
    className: classes.join(' '),
    onClick,
  }
  return <View {...viewProps}/>
}

export { BrowserSource, BrowserSourceProps }
