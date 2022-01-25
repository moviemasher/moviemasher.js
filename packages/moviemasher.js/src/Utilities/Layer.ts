import { Layer } from "../declarations"


const layerLastLabel = (layer: Layer): string | undefined => {
  const { filters } = layer
  const last = filters[filters.length - 1]
  const { outputs } = last
  if (!outputs?.length) return

  return outputs[outputs.length - 1]
}


const layerToString = (layer: Layer) => {

}

export { layerToString, layerLastLabel }
