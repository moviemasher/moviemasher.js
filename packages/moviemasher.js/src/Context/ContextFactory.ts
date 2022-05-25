import { Size, VisibleContextElement } from "../declarations"
import { AudibleContext } from "./AudibleContext"
import { VisibleContext, VisibleContextArgs } from "./VisibleContext"

const createContextVisible = (args?: VisibleContextArgs): VisibleContext => {
  return new VisibleContext(args)
}

const createContextAudible = (): AudibleContext => { return new AudibleContext() }

const createContextFromCanvas = (canvas : VisibleContextElement) : VisibleContext => {
  const context = createContextVisible()
  context.canvas = canvas
  return context
}

const createContextOfSize = (size: Size) : VisibleContext => {
  const context = createContextVisible({ size })
  return context
}

export const ContextFactory = {
  audible: createContextAudible,
  fromCanvas: createContextFromCanvas,
  toSize: createContextOfSize,
  visible: createContextVisible,
}
