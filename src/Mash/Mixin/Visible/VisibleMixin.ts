import { Cache } from "../../../Loading"
import { ContextFactory } from "../../../Playing/ContextFactory"
import { VisibleContext } from "../../../Playing/VisibleContext"
import { Any, Constrained, Size } from "../../../Setup/declarations"
import { TrackType } from "../../../Setup/Enums"
import { Time  } from "../../../Utilities/Time"
import { Clip } from "../Clip/Clip"
import { VisibleDefinition } from "./Visible"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function VisibleMixin<TBase extends Constrained<Clip>>(Base: TBase) {
  return class extends Base {
    contextAtTimeToSize(mashTime : Time, quantize: number, _dimensions : Size) : VisibleContext | undefined {
      const definitionTime = this.definitionTime(quantize, mashTime)
      const visibleDefinition = <VisibleDefinition> this.definition
      const image = visibleDefinition.loadedVisible(definitionTime)
      if (!image) return

      const width = Number(image.width)
      const height = Number(image.height)

      const context = ContextFactory.toSize({ width, height })
      context.draw(image)
      return context
    }

    mergeContextAtTime(_time : Time, _quantize: number, _context : VisibleContext) : void {}

    trackType = TrackType.Video

    visible = true
  }
}
export { VisibleMixin }
