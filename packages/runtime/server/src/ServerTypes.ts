import type { MovieMasherRuntime } from '@moviemasher/runtime-shared'

export type EventsModule = 'module'
export type EventsGlobal = 'global'
export type EventsOption = EventsModule | EventsGlobal


export interface MovieMasherServerRuntime extends MovieMasherRuntime {
  options: {
    events: EventsOption
  }
}
