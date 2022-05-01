import { PropertiedClass } from "../../../Base/Propertied"
import { DataType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { Mash } from "../../Mash/Mash"
import { Layer } from "./Layer"

export interface LayerArgs {
  mash?: Mash
  label?: string
}

export class LayerClass extends PropertiedClass implements Layer {
  constructor(args: LayerArgs) {
    super()
    const { mash, label } = args
    if (mash) this.mash = mash
    if (label) this.label = label

    this.properties.push(propertyInstance({ name: 'label', type: DataType.String }))
  }

  label = 'Unlabeled Layer'

  mash?: Mash
}
