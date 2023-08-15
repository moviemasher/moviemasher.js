import type { MovieMasherClientRuntime } from './ClientTypes.js'

import { ClientEventDispatcher } from './ClientEventDispatcher.js'
import { RequestObject } from './Requestable.js'

export class MovieMasherClient implements MovieMasherClientRuntime {
  constructor() {
    this.options = {
      assetObjectOptions: { request: {} },
      assetObjectsOptions: { request: {} },
      iconOptions: { request: {} },
    }
  }
  options: { assetObjectOptions?: RequestObject | undefined; assetObjectsOptions?: RequestObject | undefined; iconOptions?: RequestObject | undefined }
  eventDispatcher = new ClientEventDispatcher()

}

export const MovieMasher = new MovieMasherClient()