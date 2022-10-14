import { LayerType } from "@moviemasher/moviemasher.js"
import React from "react"
import { PropsAndChildren, ReactResult } from "../../declarations"
import { useLayer } from "../../Hooks/useLayer"

/**
 * @parents ComposerContent
 */
export function ComposerLayerMash(props: PropsAndChildren): ReactResult {
  const layer = useLayer()
  if (layer.type !== LayerType.Mash) return null

  return <>{props.children}</>
}
