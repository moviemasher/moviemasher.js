import type { EventServerDecodeStatusDetail, EventServerEncodeStatusDetail, EventServerTranscodeStatusDetail } from './event-types.js'

console.trace('server-lib events.js')

import '../runtime.js'

import { customEventClass } from '@moviemasher/shared-lib/runtime.js'

/**
 * Dispatch to retrieve a promise that returns progress or decoding if finished.
 * @category ServerEvents
 */

export class EventServerDecodeStatus extends customEventClass<EventServerDecodeStatusDetail>() {
  static Type = 'decode-status'
  constructor(id: string) {
    super(EventServerDecodeStatus.Type, { detail: { id } })
  }
}

/**
 * Dispatch to retrieve a promise that returns encoding if finished.
 * @category ServerEvents
 */

export class EventServerEncodeStatus extends customEventClass<EventServerEncodeStatusDetail>() {
  static Type = 'encode-status'
  constructor(id: string) {
    super(EventServerEncodeStatus.Type, { detail: { id } })
  }
}


/**
 * Dispatch to retrieve a promise that returns progress or transcoding if finished.
 * @category ServerEvents
 */


export class EventServerTranscodeStatus extends customEventClass<EventServerTranscodeStatusDetail>() {
  static Type = 'transcode-status'
  constructor(id: string) {
    super(EventServerTranscodeStatus.Type, { detail: { id } })
  }
}
