import React from "react"
import { definitionsByType, DefinitionType, DefinitionTypes, UnknownObject } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"
import { BrowserContext } from "./BrowserContext"
import { SourceCallback } from "../../declarations"

interface BrowserSourceProps extends UnknownObject {
  id: string
  children: React.ReactNode
  className?: string
  definitionType?: DefinitionType
  promiseProvider?: SourceCallback
}

const BrowserSource: React.FC<BrowserSourceProps> = props => {
  const { className, id, definitionType, promiseProvider, ...rest } = props
  const type = definitionType || id as DefinitionType

  if (!promiseProvider) {
    if (!definitionType) {
      if (!DefinitionTypes.map(String).includes(id)) {
        throw "BrowserSource requires definitionType or promiseProvider"
      }
    }
  }

  const browserContext = React.useContext(BrowserContext)
  const { definitions, sourceId, setDefinitions, setSourceId, setDefinitionId } = browserContext

  const classes = []
  if (className) classes.push(className)


  if (sourceId === id) {
    // TODO: get from props or context
    classes.push('moviemasher-selected')

    if (typeof definitions === 'undefined') {
      if (promiseProvider) {
        promiseProvider().then(definitions => setDefinitions(definitions))
      } else {
        setTimeout(() => {
          const definitions = definitionsByType(type)
          // console.log("BrowserSource", id, "setDefinitions", type, definitions.map(d => d.label || d.id))
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

export { BrowserSource }
