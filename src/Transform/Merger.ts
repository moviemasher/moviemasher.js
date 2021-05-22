
import { idMutable } from "../Base/with/idMutable"

import { ModuleType } from "../Setup"
import { drawMerger } from "./with/drawMerger"
import { Transform } from "./Transform"

class Merger extends Transform {
  type : string = ModuleType.merger
}

Object.defineProperties(Merger.prototype, {
  ...idMutable,
  ...drawMerger,
})

export { Merger }
