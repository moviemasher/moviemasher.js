import type { MovieMasherClientRuntime } from './ClientTypes.js'

import { importPromise } from '@moviemasher/runtime-shared'
import { ClientEventDispatcher } from './ClientEventDispatcher.js'

export const MovieMasher: MovieMasherClientRuntime = {
  eventDispatcher: new ClientEventDispatcher(),
  options: {
    imports: {
      ClientColorImageListeners: '@moviemasher/lib-client/asset/color/image.js',
      ClientMashVideoListeners: '@moviemasher/lib-client/asset/mash/video.js',
      ClientRawAudioListeners: '@moviemasher/lib-client/asset/raw/audio.js',
      ClientRawImageListeners: '@moviemasher/lib-client/asset/raw/image.js',
      ClientRawVideoListeners: '@moviemasher/lib-client/asset/raw/video.js',
      ClientShapeImageListeners: '@moviemasher/lib-client/asset/shape/image.js',
      ClientTextImageListeners: '@moviemasher/lib-client/asset/text/image.js',
      ClientAssetManagerListeners: '@moviemasher/lib-client/asset/manager.js',
    },
  },
  get importPromise() { 
    const { options, eventDispatcher } = MovieMasher
    const { imports } = options
    return importPromise(imports, eventDispatcher)
  },
}
