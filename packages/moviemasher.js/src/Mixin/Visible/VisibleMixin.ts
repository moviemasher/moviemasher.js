import { ContextFactory } from "../../Context/ContextFactory"
import { VisibleContext } from "../../Context/VisibleContext"
import { Size } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time  } from "../../Helpers/Time"
import { ClipClass } from "../Clip/Clip"
import { VisibleClass, VisibleDefinition } from "./Visible"
import { LoadedInfo, Preloader } from "../../Preloader/Preloader"

function VisibleMixin<T extends ClipClass>(Base: T) : VisibleClass & T {
  return class extends Base {
    contextAtTimeToSize(preloader: Preloader, mashTime : Time, quantize: number, _dimensions : Size) : VisibleContext | undefined {
      const definitionTime = this.definitionTime(quantize, mashTime)

      const image = this.definition.loadedVisible(preloader, quantize, definitionTime)
      if (!image) {
        console.trace(this.constructor.name, "contextAtTimeToSize not loaded", this.definition.id)
        return
      }
      const width = Number(image.width)
      const height = Number(image.height)

      const context = ContextFactory.toSize({ width, height })
      context.draw(image)
      return context
    }

    declare definition: VisibleDefinition

    mergeContextAtTime(preloader: Preloader, _time : Time, _quantize: number, _context : VisibleContext) : void {}

    trackType = TrackType.Video

    visible = true
  }
}
export { VisibleMixin }
