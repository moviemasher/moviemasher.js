import { UnknownObject } from "../../../declarations"
import { Default } from "../../../Setup/Default"
import { LayerType } from "../../../Setup/Enums"
import { Mashes } from "../../Mash/Mash"
import { LayerFolder, LayerFolderArgs, Layers } from "./Layer"
import { LayerClass } from "./LayerClass"

export class LayerFolderClass extends LayerClass implements LayerFolder {
  constructor(args: LayerFolderArgs) {
    super(args)

    // propertiesInitialize doesn't set defaults
    const { label, layers, collapsed } = args
    if (!label) this.label = Default.label

    this.collapsed = collapsed
    this.layers = layers
  }

  collapsed: boolean

  layers: Layers

  get mashes(): Mashes {
    return this.layers.flatMap(layer => layer.mashes)
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.layers = this.layers
    json.collapsed = this.collapsed
    return json
  }

  type = LayerType.Folder
}
