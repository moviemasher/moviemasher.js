import { AddLayerAction } from "./AddLayerAction"
import { Layer, LayerAndPosition } from "../../../Edited/Cast/Layer/Layer"
import { assertLayer } from "../../../Edited/Cast/Layer/LayerFactory"

/**
 * @category Action
 */
export class MoveLayerAction extends AddLayerAction {
 
  get layer(): Layer { 
    const { layer } = this.redoSelection
    assertLayer(layer)
    return layer
  }
  undoLayerAndPosition?: LayerAndPosition

  redoAction(): void { this.undoLayerAndPosition = this.cast.moveLayer(this.layer, this.layerAndPosition) }

  undoAction(): void { this.cast.moveLayer(this.layer, this.undoLayerAndPosition) }
}
