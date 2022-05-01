import React from "react"
import { View } from "../../Utilities/View"
import { BrowserContext } from "../../Contexts/BrowserContext"
import { BrowserDefinition } from "./BrowserDefinition"
import { WithClassName, ReactResult, PropsAndChild } from "../../declarations"

export interface BrowserContentProps extends WithClassName, PropsAndChild {}

/**
 * @parents Browser
 * @children BrowserSource
 */
export function BrowserContent(props: BrowserContentProps): ReactResult {
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
