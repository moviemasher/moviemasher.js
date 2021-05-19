
import { idMutable } from "../Base/with/idMutable"

import { ModuleType } from "../Setup"
import { drawMerger } from "./with/drawMerger"
import { Transform } from "./Transform"

class Merger extends Transform {}

Object.defineProperties(Merger.prototype, {
  type: { value: ModuleType.merger },
  ...idMutable,
  ...drawMerger,
})

export { Merger }