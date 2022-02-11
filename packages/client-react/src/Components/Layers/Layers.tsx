import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"

interface LayersProps extends PropsAndChildren, WithClassName {}

/**
 * @parents Masher, Caster
 * @children LayersContent, Playing, LayersNotPlaying, TimeSlider, LayersButton
 */
function Layers(props: LayersProps): ReactResult {
  return null
}

export { Layers, LayersProps }
