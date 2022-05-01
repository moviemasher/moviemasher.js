import React from "react"
import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { useCastEditor } from "../../Hooks/useCastEditor"
import { View } from "../../Utilities/View"

export interface CasterLayersProps extends PropsAndChildren, WithClassName {}

/**
 * @parents Caster
 * @children LayersContent, PlayerPlaying, LayersNotPlaying, PlayerTimeControl, LayersButton
 */
export function CasterLayers(props: CasterLayersProps): ReactResult {
  const caster = useCastEditor()
  const { cast } = caster

  const viewProps = {
    ...props
  }
  return <View {...viewProps}/>
}
