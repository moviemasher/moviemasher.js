import { UnknownObject } from "../../../declarations"
import { LayerType } from "../../../Setup"
import { Mash, Mashes } from "../../Mash/Mash"
import { LayerMash, LayerMashArgs } from "./Layer"
import { LayerClass } from "./LayerClass"

export class LayerMashClass extends LayerClass implements LayerMash {
  constructor(args: LayerMashArgs) {
    super(args)

    const { mash } = args
    // console.log("LayerMashClass", this.label, mash.label)
    if (!this.label) this.label = mash.label
    this.mash = mash
    mash.layer = this
  }

  get mashes(): Mashes { return [this.mash] }

  mash: Mash

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.mash = this.mash
    return json
  }
  type = LayerType.Mash
}
