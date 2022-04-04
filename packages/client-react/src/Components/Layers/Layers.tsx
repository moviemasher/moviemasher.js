import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"

interface LayersProps extends PropsAndChildren, WithClassName {}

/**
 * @parents Masher, Caster
 * @children LayersContent, PlayerPlaying, LayersNotPlaying, PlayerTimeControl, LayersButton
 */
function Layers(props: LayersProps): ReactResult {
  return null
}

export { Layers, LayersProps }
