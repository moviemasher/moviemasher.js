import { Size, Context2D } from "../Setup/declarations"
import { AudibleContext } from "./AudibleContext"
import { VisibleContext } from "./VisibleContext"

const ContextTypes = ["audible", "visible"]
const ContextType = Object.fromEntries(ContextTypes.map(type => [type, type]))

class ContextFactory {

  toSize(size: Size) {
    const context = this.visible()
    context.size = size
    return context
  }

  audible() : AudibleContext { return new AudibleContext() }

  fromContext2D(context2d : Context2D) : VisibleContext {
    return new VisibleContext({ context2d })
  }

  get type() { return ContextType }

  get types() { return ContextTypes }

  visible() { return new VisibleContext() }
}

const ContextFactoryInstance = new ContextFactory()

export { ContextFactoryInstance as ContextFactory }
