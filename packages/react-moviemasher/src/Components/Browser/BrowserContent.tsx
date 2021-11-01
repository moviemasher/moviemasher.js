import React from "react"
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"
import { BrowserContext } from "./BrowserContext"
import { BrowserDefinition } from "./BrowserDefinition"

interface BrowserContentProps extends UnknownObject {
  children: React.ReactNode
  className?: string
}

const BrowserContent: React.FC<BrowserContentProps> = props => {
  const { className, children, ...rest } = props
  const browserContext = React.useContext(BrowserContext)

  const { definitions } = browserContext
  const objects = definitions || []
  const kid = React.Children.only(children)
  if (!React.isValidElement(kid)) throw `BrowserContent expects single child element`

  const viewChildren = objects.map(definition => {
    const definitionProps = {
      ...rest,
      definition,
      children: kid,
      key: definition.id,
    }
    return <BrowserDefinition {...definitionProps} />
  })
  const viewProps = { className, children: viewChildren }
  return <View {...viewProps} />
}

export { BrowserContent }
