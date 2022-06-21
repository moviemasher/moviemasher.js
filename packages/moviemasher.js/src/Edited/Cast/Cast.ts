import { UnknownObject } from "../../declarations"
import { Edited, EditedArgs, EditedObject } from "../Edited"
import { Mashes } from "../Mash/Mash"
import { Layer, LayerAndPosition, LayerObject, LayerObjects, Layers } from "./Layer/Layer"

export interface CastObject extends EditedObject {
  layers?: LayerObjects
}

export interface CastArgs extends EditedArgs, CastObject {}

export interface Cast extends Edited {
  addLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void
  createLayer(layerObject: LayerObject): Layer
  layers: Layers
  mashes: Mashes
  moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): LayerAndPosition
  removeLayer(layer: Layer): LayerAndPosition
  toJSON(): UnknownObject
}
