import React from "react"
import { LayerFolder, LayerType } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useLayer } from "../../Hooks/useLayer"
import { Problems } from "../../Setup/Problems"
import { ComposerContext } from "./ComposerContext"

/**
 * @parents ComposerContent
 */
export function ComposerFolderOpen(props: PropsAndChild): ReactResult {
  const { children, ...rest } = props
  const child = React.Children.only(children)
  if (!React.isValidElement(child)) throw Problems.child

  const composerContext = React.useContext(ComposerContext)
  const layer = useLayer()
  if (layer.type !== LayerType.Folder) return null

  const layerFolder = layer as LayerFolder
  if (!layerFolder.collapsed) return null


  const onClick = () => {
    layerFolder.collapsed = false
    composerContext.refresh()
  }
  const childProps = { ...rest, onClick }

  return React.cloneElement(child, childProps)

}
