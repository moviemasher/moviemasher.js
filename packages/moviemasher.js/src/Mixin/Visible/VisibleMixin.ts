import { ContextFactory } from "../../Context/ContextFactory"
import { VisibleContext } from "../../Context/VisibleContext"
import { TrackType } from "../../Setup/Enums"
import { Time  } from "../../Helpers/Time/Time"
import { ClipClass } from "../Clip/Clip"
import { Visible, VisibleClass, VisibleDefinition, VisibleObject } from "./Visible"
import { Preloader } from "../../Preloader/Preloader"
import { isPositive } from "../../Utility/Is"

export function VisibleMixin<T extends ClipClass>(Base: T) : VisibleClass & T {
  return class extends Base implements Visible {

    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { mode, opacity } = object as VisibleObject
      if (isPositive(mode)) this.mode = mode
      if (isPositive(opacity)) this.opacity = opacity
    }

    contextAtTimeToSize(preloader: Preloader, definitionTime : Time, quantize: number) : VisibleContext | undefined {
      const image = this.definition.loadedVisible(preloader, quantize, definitionTime)
      if (!image) {
        console.trace(this.constructor.name, "contextAtTimeToSize not loaded", this.definition.id)
        return
      }
      const width = Number(image.width)
      const height = Number(image.height)

      const context = ContextFactory.visible({
        size: { width, height }, label: `${this.constructor.name} ${this.definitionId}`
      })
      context.draw(image)
      return context
    }

    declare definition: VisibleDefinition

    opacity = 1.0

    mode = 0

    trackType = TrackType.Video

    visible = true
  }
}
