import { AddLayerAction } from "./AddLayerAction"
import { Layer, LayerAndPosition } from "../../../Edited/Cast/Layer/Layer"

/**
 * @category Action
 */
export class MoveLayerAction extends AddLayerAction {
  get layer(): Layer { return this.redoSelection.layer! }

  undoLayerAndPosition?: LayerAndPosition

  redoAction(): void { this.undoLayerAndPosition = this.cast.moveLayer(this.layer, this.layerAndPosition) }

  undoAction(): void { this.cast.moveLayer(this.layer, this.undoLayerAndPosition) }
}
