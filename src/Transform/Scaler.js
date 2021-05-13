import { idMutable } from "../Base/with/idMutable"
import { ModuleType } from "../Types"
import { drawMediaFilters } from "../Clip/with/drawMediaFilters"
import { Transform } from "./Transform"

class Scaler extends Transform {}

Object.defineProperties(Scaler.prototype, {
  type: { value: ModuleType.scaler },
  ...idMutable,
  ...drawMediaFilters,
})

export { Scaler }
