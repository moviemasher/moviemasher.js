import { Size, Context2D, VisibleContextElement } from "../declarations"
import { AudibleContext } from "./AudibleContext"
import { VisibleContext } from "./VisibleContext"

const ContextTypes = ["audible", "visible"]
const ContextType = Object.fromEntries(ContextTypes.map(type => [type, type]))

class ContextFactory {
  audible() : AudibleContext { return new AudibleContext() }

  fromCanvas(canvas : VisibleContextElement) : VisibleContext {
    const context = this.visible()
    context.canvas = canvas
    return context
  }

  fromContext2D(context2d : Context2D) : VisibleContext {
    return new VisibleContext({ context2d })
  }

  toSize(size: Size) {
    const context = this.visible()
    context.size = size
    return context
  }

  get type() { return ContextType }

  get types() { return ContextTypes }

  visible() { return new VisibleContext() }
}

const ContextFactoryInstance = new ContextFactory()

export { ContextFactoryInstance as ContextFactory }
