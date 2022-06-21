
import { ImageDefinitionObject } from "../../../packages/moviemasher.js/src/Media/Image/Image"
import { imageDefinition } from "../../../packages/moviemasher.js/src/Media/Image/ImageFactory"
import { DefinitionType } from "../../../packages/moviemasher.js/src/Setup/Enums"
import { mashInstance } from "../../../packages/moviemasher.js/src/Edited/Mash/MashFactory"
import { Defined } from "../../../packages/moviemasher.js/src/Base/Defined"
import { visibleClipDefault } from "../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClipFactory"
import { VisibleClipObject } from "../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClip"
import { imageDefinitionObject } from "./Image"
import { visibleClipObjectWithImage } from "./VisibleClip"
import { Mash } from "../../../packages/moviemasher.js/src/Edited/Mash/Mash"

export const mashWithClips = (...clips: VisibleClipObject[]): Mash => {

  return mashInstance({ tracks: [{ clips }]})
}

export const mashWithImage = () => {
  return mashWithClips(visibleClipObjectWithImage())
}