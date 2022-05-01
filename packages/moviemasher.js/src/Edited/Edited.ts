import { Described, Size, VisibleContextData } from "../declarations"
import { Propertied } from "../Base/Propertied"
import { Emitter } from "../Helpers/Emitter"

export interface Edited extends Described, Propertied {
  emitter?: Emitter
  imageData: VisibleContextData
  imageSize : Size
}
