import { GraphFiles, LoadPromise, UnknownObject } from "../../declarations"
import { Edited, EditedArgs, EditedObject } from "../Edited"
import { FilterGraphOptions } from "../Mash/FilterGraph/FilterGraph"
import { Mashes } from "../Mash/Mash"
import { Layer, LayerAndPosition, LayerObject, LayerObjects, Layers } from "./Layer/Layer"

export interface CastObject extends EditedObject {
  layers?: LayerObjects
}

export interface CastArgs extends EditedArgs, CastObject {}

export interface Cast extends Edited {
  addLayer(layer: Layer, layerAndPosition?: LayerAndPosition): void
  createLayer(layerObject: LayerObject): Layer
  graphFiles(args: FilterGraphOptions): GraphFiles
  layers: Layers
  loadPromise(): LoadPromise
  mashes: Mashes
  moveLayer(layer: Layer, layerAndPosition?: LayerAndPosition): LayerAndPosition
  removeLayer(layer: Layer): LayerAndPosition
  toJSON(): UnknownObject
}
