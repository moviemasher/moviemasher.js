import { Propertied } from "../Base/Propertied"
import {
  Described, Size, VisibleContextData
} from "../declarations"
import { Emitter } from "../Helpers/Emitter"

interface Edited extends Described, Propertied {
  emitter?: Emitter
  imageData: VisibleContextData
  imageSize : Size
}

export { Edited }
