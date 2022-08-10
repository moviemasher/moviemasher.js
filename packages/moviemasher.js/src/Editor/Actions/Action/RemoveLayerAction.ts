import { Action } from "./Action"
import { Layer, LayerAndPosition } from "../../../Edited/Cast/Layer/Layer"
import { assertLayer } from "../../../Edited/Cast/Layer/LayerFactory"

/**
 * @category Action
 */
export class RemoveLayerAction extends Action {

  get layer(): Layer { 
    const { layer } = this.redoSelection
    assertLayer(layer)
    return layer
  }
  layerAndPosition?: LayerAndPosition

  redoAction(): void { this.layerAndPosition = this.cast.removeLayer(this.layer) }

  undoAction(): void { this.cast.addLayer(this.layer, this.layerAndPosition) }
}
