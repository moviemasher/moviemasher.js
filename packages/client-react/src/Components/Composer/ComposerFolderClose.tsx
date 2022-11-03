import React from "react"
import { eventStop, LayerFolder, LayerType } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useLayer } from "../../Hooks/useLayer"
import { Problems } from "../../Setup/Problems"
import { ComposerContext } from "./ComposerContext"

/**
 * @parents ComposerContent
 */
export function ComposerFolderClose(props: PropsAndChild): ReactResult {
  const composerContext = React.useContext(ComposerContext)
  const layer = useLayer()
  if (layer.type !== LayerType.Folder) return null

  const layerFolder = layer as LayerFolder
  if (layerFolder.collapsed) return null

  const { children, ...rest } = props
  const child = React.Children.only(children)
  if (!React.isValidElement(child)) throw Problems.child
  const onPointerDown = (event: React.PointerEvent): void => {
    event.stopPropagation()
    layerFolder.collapsed = true
    composerContext.refresh()
  }
  const childProps = { ...rest, onPointerDown }

  return React.cloneElement(child, childProps)
}
