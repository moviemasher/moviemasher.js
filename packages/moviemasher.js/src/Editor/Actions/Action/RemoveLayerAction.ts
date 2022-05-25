import { Action } from "./Action"
import { Layer, LayerAndPosition } from "../../../Edited/Cast/Layer/Layer"

/**
 * @category Action
 */
export class RemoveLayerAction extends Action {
  get layer(): Layer { return this.redoSelection.layer! }

  layerAndPosition?: LayerAndPosition

  redoAction(): void { this.layerAndPosition = this.cast.removeLayer(this.layer) }

  undoAction(): void { this.cast.addLayer(this.layer, this.layerAndPosition) }
}
