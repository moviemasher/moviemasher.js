import { ContextFactory } from "../../Context/ContextFactory"
import { VisibleContext } from "../../Context/VisibleContext"
import { TrackType } from "../../Setup/Enums"
import { Time  } from "../../Helpers/Time/Time"
import { ClipClass } from "../Clip/Clip"
import { Visible, VisibleClass, VisibleDefinition } from "./Visible"
import { Preloader } from "../../Preloader/Preloader"

function VisibleMixin<T extends ClipClass>(Base: T) : VisibleClass & T {
  return class extends Base implements Visible {
    contextAtTimeToSize(preloader: Preloader, definitionTime : Time, quantize: number) : VisibleContext | undefined {
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

    trackType = TrackType.Video

    visible = true
  }
}
export { VisibleMixin }
