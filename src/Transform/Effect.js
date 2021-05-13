import { id } from "../Clip/with/id"

import { ModuleType } from "../Types"
import { drawMediaFilters } from "../Clip/with/drawMediaFilters"
import { Transform } from "./Transform"

class Effect extends Transform {}

Object.defineProperties(Effect.prototype, {
  type: { value: ModuleType.effect },
  ...id,
  ...drawMediaFilters,
})

export { Effect }