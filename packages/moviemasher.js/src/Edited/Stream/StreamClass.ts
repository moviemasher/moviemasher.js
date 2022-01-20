import { Any, Segment, SegmentOptions, SegmentPromise, Size, UnknownObject, VisibleContextData } from "../../declarations"
import { Emitter } from "../../Helpers/Emitter"

import { idGenerate } from "../../Utilities/Id"
import { isPopulatedString } from "../../Utilities/Is"
import { Mash } from "../Mash/Mash"
import { MashFactory } from "../Mash/MashFactory"
import { StreamObject } from "./Stream"

class StreamClass {
  constructor(...args: Any[]) {
    const object = args[0] || {}
    const {
      createdAt,
      id,
      label,
      ...rest
    } = <StreamObject>object

    if (id) this._id = id
    if (createdAt) this.createdAt = createdAt
    if (label && isPopulatedString(label)) this.label = label

    Object.assign(this.data, rest)
    this.mash = MashFactory.instance({
      tracks: [{ clips: [{ definitionId: 'id-image' }] }]
    })
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

  mash: Mash

  mashes: Mash[] = []

  segment(options: SegmentOptions): Segment { return this.mash.segment(options) }

  segmentPromise(options: SegmentOptions): SegmentPromise { return this.mash.segmentPromise(options) }

  toJSON(): UnknownObject {
    return {
      label: this.label,
      id: this.id,
      createdAt: this.createdAt,
      ...this.data,
    }
  }
}

export { StreamClass }
