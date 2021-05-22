import { ClipType } from "../Setup"
import { inaudible } from "./with/inaudible"
import { speedOne } from "./with/speedOne"
import { urls } from "./with/urls"
import { transform } from "./with/transform"
import { evaluator } from "./with/evaluator"
import { Context, Is } from "../Utilities"
import { drawMediaFilters } from "./with/drawMediaFilters"
import { mediaTime } from "./with/mediaTime"
import { Clip } from "./Clip"
import { VisibleClip } from "../Decorators/VisibleClip"

@VisibleClip
class ThemeClip extends Clip {
  type : string = ClipType.theme
}

Object.defineProperties(ThemeClip.prototype, {
  ...inaudible,
  ...speedOne,
  ...urls,
  ...inaudible,
  ...transform,
  ...evaluator,
  ...drawMediaFilters,
  ...mediaTime,
  contextAtTimeForDimensions: {
    value(mashTime, dimensions) {
      const context = Context.createDrawing(dimensions.width, dimensions.height)
      const clipTimeRange = this.timeRangeRelative(mashTime)
      // if (Is.undefined(clipTimeRange)) return

      return this.drawMediaFilters(clipTimeRange, context, dimensions)
    }
  },
})

export { ThemeClip }
