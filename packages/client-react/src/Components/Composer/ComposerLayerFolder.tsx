import React from "react"
import { LayerType } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult } from "../../declarations"
import { useLayer } from "../../Hooks/useLayer"

/**
 * @parents ComposerContent
 */
export function ComposerLayerFolder(props: PropsAndChildren): ReactResult {
  const layer = useLayer()
  if (layer.type !== LayerType.Folder) return null

  return <>{props.children}</>
}
