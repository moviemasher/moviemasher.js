import {
  Any, GraphFiles, Size, UnknownObject, VisibleContextData
} from "../../declarations"
import { Emitter } from "../../Helpers/Emitter"
import { idGenerate } from "../../Utility/Id"
import { isPopulatedString } from "../../Utility/Is"
import { Mash } from "../Mash/Mash"
import { MashFactory } from "../Mash/MashFactory"
import { CastObject, Cast } from "./Cast"
import { FilterGraphOptions } from "../Mash/FilterGraph/FilterGraph"

class CastClass implements Cast {
  constructor(...args: Any[]) {
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
    this.mashes.push(MashFactory.instance({
      tracks: [{ clips: [{ definitionId: 'id-image' }] }]
    }))
  }

  createdAt = ''

  data: UnknownObject = {}

  private _emitter?: Emitter

  get emitter(): Emitter | undefined { return this._emitter }

  set emitter(value: Emitter | undefined) {
    this._emitter = value
    this.mash.emitter = value
  }
  private _id = ''

  get id(): string { return this._id ||= idGenerate() }

  get imageData() : VisibleContextData { return this.mash.imageData }

  get imageSize() : Size { return this.mash.imageSize }

  set imageSize(value : Size) {this.mash.imageSize = value }

  label = ''

  get mash(): Mash { return this.mashes[0] }

  mashes: Mash[] = []

  graphFiles(args: FilterGraphOptions): GraphFiles  {
    const graphFiles = this.mashes.flatMap(mash => mash.graphFiles(args))
    return graphFiles
  }

  toJSON(): UnknownObject {
     const json: UnknownObject = {
      label: this.label,
      createdAt: this.createdAt,
      ...this.data,
    }
    if (this._id) json.id = this.id
    return json

  }
}

export { CastClass }
