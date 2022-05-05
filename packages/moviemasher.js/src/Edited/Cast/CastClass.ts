import { Any, GraphFiles, Size, VisibleContextData } from "../../declarations"
import { Mash } from "../Mash/Mash"
import { CastObject, Cast } from "./Cast"
import { FilterGraphOptions } from "../Mash/FilterGraph/FilterGraph"
import { EditedClass } from "../EditedClass"
import { Default } from "../../Setup/Default"
import { Layers } from "./Layer/Layer"

export class CastClass extends EditedClass implements Cast {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const {
      createdAt,
      id,
      label,
      ...rest
    } = object as CastObject

    // propertiesInitialize doesn't set defaults
    if (!label) this.label = Default.cast.label
    this.dataPopulate(rest)
  }

  protected override emitterChanged() {
    this.mash.emitter = this._emitter
  }

  get imageData() : VisibleContextData { return this.mash.imageData }

  get imageSize() : Size { return this.mash.imageSize }

  set imageSize(value: Size) { this.mash.imageSize = value }

  layers: Layers = []

  get mash(): Mash { return this.mashes[0] }

  mashes: Mash[] = []

  graphFiles(args: FilterGraphOptions): GraphFiles  {
    const graphFiles = this.mashes.flatMap(mash => mash.graphFiles(args))
    return graphFiles
  }

}
