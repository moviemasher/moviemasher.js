import {
  Any, GraphFiles, Size, UnknownObject, VisibleContextData
} from "../../declarations"
import { Emitter } from "../../Helpers/Emitter"
import { isPopulatedString } from "../../Utility/Is"
import { Mash } from "../Mash/Mash"
import { MashFactory } from "../Mash/MashFactory"
import { CastObject, Cast } from "./Cast"
import { FilterGraphOptions } from "../Mash/FilterGraph/FilterGraph"
import { DefinitionType } from "../../Setup/Enums"
import { BrowserPreloaderClass } from "../../Preloader/BrowserPreloaderClass"
import { EditedClass } from "../EditedClass"


class CastClass extends EditedClass implements Cast {
  constructor(...args: Any[]) {
    super()
    const object = args[0] || {}
    const {
      createdAt,
      id,
      label,
      ...rest
    } = <CastObject>object

    if (id) this._id = id
    if (createdAt) this.createdAt = createdAt
    if (label && isPopulatedString(label)) this.label = label

    Object.assign(this.data, rest)
    const definitionId = 'id-image'
    const url = '../shared/image.jpg'
    this.mashes.push(MashFactory.instance({
      tracks: [{ clips: [{ definitionId }] }]
    }, [{
      type: DefinitionType.Image, id: definitionId, source: url, url
    }], new BrowserPreloaderClass()))
  }

  protected override emitterChanged() {
    this.mash.emitter = this._emitter
  }

  get imageData() : VisibleContextData { return this.mash.imageData }

  get imageSize() : Size { return this.mash.imageSize }

  set imageSize(value : Size) {this.mash.imageSize = value }


  get mash(): Mash { return this.mashes[0] }

  mashes: Mash[] = []

  graphFiles(args: FilterGraphOptions): GraphFiles  {
    const graphFiles = this.mashes.flatMap(mash => mash.graphFiles(args))
    return graphFiles
  }

}

export { CastClass }
