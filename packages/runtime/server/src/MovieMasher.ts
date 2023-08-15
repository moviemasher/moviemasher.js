import { ServerEventDispatcher } from './ServerEventDispatcher.js'
import type { EventsGlobal, EventsModule, MovieMasherServerRuntime } from './ServerTypes.js'

export const EVENTS_MODULE: EventsModule = 'module'
export const EVENTS_GLOBAL: EventsGlobal = 'global'


export class MovieMasherServer implements MovieMasherServerRuntime {
  private _eventDispatcher?: ServerEventDispatcher
  get eventDispatcher(): ServerEventDispatcher {
    return this._eventDispatcher ||= this.eventDispatcherInitialize
  } 
  get eventDispatcherInitialize() {
    return new ServerEventDispatcher()

    // const { events } = this.options
    // switch (events) {
    //   case EVENTS_MODULE: {
    //     import('./ServerEventDispatcher.js').then((lib) => {
    //       return new lib.ServerEventDispatcher()
    //     })
    //     break
    //   }
    //   case EVENTS_GLOBAL: return new Promise(new ServerEventDispatcher())
    // }
  }
  
  options = { 
    events: EVENTS_MODULE
  }
}

export const MovieMasher = new MovieMasherServer()