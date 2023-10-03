import type { MovieMasherServerRuntime } from './ServerTypes.js'

import { importPromise } from '@moviemasher/runtime-shared'
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
      ServerAssetPromiseListeners: '@moviemasher/lib-server/asset/promise.js',
      ServerEncodeAudioListeners: '@moviemasher/lib-server/encode/encode.js',
      ServerEncodeImageListeners: '@moviemasher/lib-server/encode/encode.js',
      ServerEncodeVideoListeners: '@moviemasher/lib-server/encode/encode.js',
      ServerEncodeStatusListeners: '@moviemasher/lib-server/encode/encode.js',
      ServerDecodeProbeListeners: '@moviemasher/lib-server/decode/probe.js',
      ServerTranscodeListeners: '@moviemasher/lib-server/transcode/transcode.js',
      ServerTranscodeStatusListeners: '@moviemasher/lib-server/transcode/transcode.js',
    },
  },
  get importPromise() { 
    const { options, eventDispatcher } = MovieMasher
    const { imports } = options
    return importPromise(imports, eventDispatcher)
  },
}
