import { id } from "../Clip/with/id"

import { ModuleType } from "../Setup"
import { drawMediaFilters } from "../Clip/with/drawMediaFilters"
import { Transform } from "./Transform"

class Effect extends Transform {
  type : string = ModuleType.effect
}

Object.defineProperties(Effect.prototype, {
  ...id,
  ...drawMediaFilters,
})

export { Effect }
