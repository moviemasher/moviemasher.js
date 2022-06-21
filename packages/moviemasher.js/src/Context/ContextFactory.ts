import { AudibleContext } from "./AudibleContext"

const createContextAudible = (): AudibleContext => { return new AudibleContext() }

export const ContextFactory = {
  audible: createContextAudible,
}
