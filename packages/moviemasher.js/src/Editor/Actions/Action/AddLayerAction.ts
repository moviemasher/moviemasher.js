import { Action, ActionOptions } from "./Action"
import { Layer, LayerAndPosition } from "../../../Edited/Cast/Layer/Layer"

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

  get layer(): Layer { return this.redoSelection.layer! }

  redoAction() : void { this.cast.addLayer(this.layer, this.layerAndPosition) }

  undoAction() : void { this.cast.removeLayer(this.layer) }
}
