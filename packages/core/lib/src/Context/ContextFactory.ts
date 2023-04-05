import { AudibleContext } from './AudibleContext.js'

const createContextAudible = (): AudibleContext => { return new AudibleContext() }

export const ContextFactory = {
  audible: createContextAudible,
}
