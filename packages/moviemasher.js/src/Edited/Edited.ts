import {
  Described, FilterGraph, FilterGraphArgs, Size, VisibleContextData
} from "../declarations"
import { Emitter } from "../Helpers/Emitter"

interface Edited extends Described {
  emitter?: Emitter
  filterGraph(args: FilterGraphArgs): FilterGraph
  imageData: VisibleContextData
  imageSize : Size
}

export { Edited }
