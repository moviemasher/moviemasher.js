import { ContextFactory } from "../../Context/ContextFactory"
import { VisibleContext } from "../../Context/VisibleContext"
import { VisibleSource, Size } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time  } from "../../Helpers/Time"
import { ClipClass } from "../Clip/Clip"
import { VisibleClass, VisibleDefinition } from "./Visible"

function VisibleMixin<T extends ClipClass>(Base: T) : VisibleClass & T {
  return class extends Base {
    contextAtTimeToSize(mashTime : Time, quantize: number, _dimensions : Size) : VisibleContext | undefined {
      const definitionTime = this.definitionTime(quantize, mashTime)
      // console.debug(this.constructor.name, "contextAtTimeToSize", definitionTime.toString(), mashTime.toString())
      const image = this.loadedVisible(quantize, definitionTime)
      if (!image) {
        console.error(this.constructor.name, "contextAtTimeToSize not loaded", this.id)
        return
      }
      const width = Number(image.width)
      const height = Number(image.height)

      const context = ContextFactory.toSize({ width, height })
      context.draw(image)
      return context
    }

    declare definition: VisibleDefinition


    loadedVisible(quantize: number, definitionTime:Time):VisibleSource | undefined {
      return this.definition.loadedVisible(quantize, definitionTime)
    }

    mergeContextAtTime(_time : Time, _quantize: number, _context : VisibleContext) : void {}

    trackType = TrackType.Video

    visible = true
  }
}
export { VisibleMixin }
