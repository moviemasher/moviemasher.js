import type { MovieMasherServerRuntime } from './ServerTypes.js'

import { MovieMasherImportPromise } from '@moviemasher/runtime-shared'
import { ServerEventDispatcher } from './ServerEventDispatcher.js'

export const MovieMasher: MovieMasherServerRuntime = {
  eventDispatcher: new ServerEventDispatcher(),
  options: {
    imports: {
      ServerColorImageListeners: '@moviemasher/lib-server/asset/color/image.js',
      ServerMashVideoListeners: '@moviemasher/lib-server/asset/mash/video.js',
      ServerRawAudioListeners: '@moviemasher/lib-server/asset/raw/audio.js',
      ServerRawImageListeners: '@moviemasher/lib-server/asset/raw/image.js',
      ServerRawVideoListeners: '@moviemasher/lib-server/asset/raw/video.js',
      ServerShapeImageListeners: '@moviemasher/lib-server/asset/shape/image.js',
      ServerTextImageListeners: '@moviemasher/lib-server/asset/text/image.js',
      ServerAssetManagerListeners: '@moviemasher/lib-server/asset/manager.js',
      ServerDecodeProbeListeners: '@moviemasher/lib-server/decode/probe.js',
      ServerEncodeAudioListeners: '@moviemasher/lib-server/encode/start.js',
      ServerEncodeImageListeners: '@moviemasher/lib-server/encode/start.js',
      ServerEncodeVideoListeners: '@moviemasher/lib-server/encode/start.js',
      // ServerEncodeProgressListeners: '@moviemasher/lib-server/progress.js',
      // ServerEncodeFinishListeners: '@moviemasher/lib-server/encode/finish.js',
      ServerAssetPromiseListeners: '@moviemasher/lib-server/asset/promise.js',
      ServerTranscodeListeners: '@moviemasher/lib-server/transcode/transcode.js',
    },
  },
  get importPromise() { 
    const { options, eventDispatcher } = MovieMasher
    const { imports } = options
    return MovieMasherImportPromise(imports, eventDispatcher)
  },
}
