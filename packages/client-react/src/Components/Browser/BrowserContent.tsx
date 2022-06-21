import React from "react"

import { WithClassName, ReactResult, PropsAndChild } from "../../declarations"
import { Problems } from "../../Setup/Problems"
import { View } from "../../Utilities/View"
import { BrowserContext } from "../../Contexts/BrowserContext"
import { DefinitionContext } from "../../Contexts/DefinitionContext"

export interface BrowserContentProps extends WithClassName, PropsAndChild {}

/**
 * @parents Browser
 * @children BrowserSource
 */
export function BrowserContent(props: BrowserContentProps): ReactResult {
  const { children, ...rest } = props
  const child = React.Children.only(children)
  if (!React.isValidElement(child)) throw Problems.child

  const browserContext = React.useContext(BrowserContext)
  const definitions = browserContext.definitions || []

  const viewProps = {
    ...rest, children: definitions.map(definition => {
      const definitionProps = { definition, key: definition.id }
      const children = React.cloneElement(child, definitionProps)
      const contextProps = { children, value: { definition }, key: definition.id }
      const context = <DefinitionContext.Provider { ...contextProps } />
      return context
    })
  }
  return <View {...viewProps} />
}
