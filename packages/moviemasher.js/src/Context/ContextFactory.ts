import { Size, VisibleContextElement } from "../declarations"
import { AudibleContext } from "./AudibleContext"
import { VisibleContext } from "./VisibleContext"

const createContextVisible = (): VisibleContext => { return new VisibleContext() }

const createContextAudible = (): AudibleContext => { return new AudibleContext() }

const createContextFromCanvas = (canvas : VisibleContextElement) : VisibleContext => {
  const context = createContextVisible()
  context.canvas = canvas
  return context
}

const createContextOfSize = (size: Size) : VisibleContext => {
  const context = createContextVisible()
  context.size = size
  return context
}

/**
 * @category Factory
 */
export const ContextFactory = {
  audible: createContextAudible,
  fromCanvas: createContextFromCanvas,
  toSize: createContextOfSize,
  visible: createContextVisible,
}
