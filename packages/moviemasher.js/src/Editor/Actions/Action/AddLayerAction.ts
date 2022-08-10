import { Action, ActionOptions } from "./Action"
import { Layer, LayerAndPosition } from "../../../Edited/Cast/Layer/Layer"
import { assertLayer, isLayer } from "../../../Edited"

export interface AddLayerActionObject extends ActionOptions {
  layerAndPosition?: LayerAndPosition
}

/**
 * @category Action
 */
export class AddLayerAction extends Action {
  constructor(object : AddLayerActionObject) {
    super(object)
    const { layerAndPosition } = object
    if (layerAndPosition) this.layerAndPosition = layerAndPosition
  }

  layerAndPosition?: LayerAndPosition

  get layer(): Layer { 
    const { layer } = this.redoSelection
    assertLayer(layer)
    return layer
  }

  redoAction() : void { this.cast.addLayer(this.layer, this.layerAndPosition) }

  undoAction() : void { this.cast.removeLayer(this.layer) }
}
