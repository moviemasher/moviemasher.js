import React from "react"
import { LayerContext } from "../../Contexts/LayerContext"
import { PropsAndChild, ReactResult } from "../../declarations"
import { Problems } from "../../Setup/Problems"

export function ComposerDepth(props: PropsAndChild): ReactResult {
  const layerContext = React.useContext(LayerContext)
  const { depth } = layerContext
  const child = React.Children.only(props.children)
  if (!React.isValidElement(child)) throw Problems.child

  const kids = (new Array(depth)).fill(true).map((_, index) => {
    const childProps = { ...child.props, key: `depth-${index}`}
    return React.cloneElement(child, childProps)
  })
  return <>{kids}</>
}
