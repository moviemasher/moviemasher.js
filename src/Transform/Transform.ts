import { Base } from "../Base"
import { Media } from "../Media/Media"
import { copy } from "../Base/with/copy"
import { propertyValues } from "../Clip/with/propertyValues"
import { urlsFromMedia } from "../Clip/with/urlsFromMedia"
import { labelFromObjectOrMedia } from "../Clip/with/labelFromObjectOrMedia"
import { media } from "./with/media"
import { evaluator } from "../Clip/with/evaluator"
import { editable } from "../Base/with/editable"
import { toJSONTransform } from "./with/toJSONTransform"

class Transform extends Base {
  media : Media

  constructor(object) {
    super(object)
    this.media.initializeInstance(this, object)
  }

  get properties() { return this.media.properties }
}

Object.defineProperties(Transform.prototype, {
  ...editable,
  ...copy,
  ...media,
  ...labelFromObjectOrMedia,
  ...propertyValues,
  ...urlsFromMedia,
  ...evaluator,
  ...toJSONTransform,
})

export { Transform }
