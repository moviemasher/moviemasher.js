import { idMutable } from "../Base/with/idMutable"
import { ModuleType } from "../Setup"
import { drawMediaFilters } from "../Clip/with/drawMediaFilters"
import { Transform } from "./Transform"

class Scaler extends Transform {
  type : string = ModuleType.scaler
}

Object.defineProperties(Scaler.prototype, {
  ...idMutable,
  ...drawMediaFilters,
})

export { Scaler }
