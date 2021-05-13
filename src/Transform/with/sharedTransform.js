
import { copy } from "../../Base/with/copy"
import { propertyValues } from "../../Clip/with/propertyValues"
import { urlsFromMedia } from "../../Clip/with/urlsFromMedia"
import { labelFromObjectOrMedia } from "../../Clip/with/labelFromObjectOrMedia"
import { media } from "./media"
import { evaluator } from "../../Clip/with/evaluator"
import { editable } from "../../Base/with/editable"
import { toJSONTransform } from "./toJSONTransform"
import { propertiesFromMedia } from "../../Clip/with/propertiesFromMedia"

export const sharedTransform = {
  ...editable,
  ...copy,
  ...media,
  ...labelFromObjectOrMedia,
  ...propertyValues,
  ...urlsFromMedia,
  ...evaluator,
  ...toJSONTransform,
  ...propertiesFromMedia,
}