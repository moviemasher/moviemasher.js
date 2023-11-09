import type { MovieMasherClientRuntime } from './ClientTypes.js'

import { importPromise } from '@moviemasher/runtime-shared'
import { ClientEventDispatcher } from './ClientEventDispatcher.js'

export const MovieMasher: MovieMasherClientRuntime = {
  eventDispatcher: new ClientEventDispatcher(),
  options: {
    imports: {
      ClientAssetDecodeListeners: '@moviemasher/lib-client/asset/decode.js',
      ClientAssetElementListeners: '@moviemasher/lib-client/asset/element.js',
      ClientAssetEncodeListeners: '@moviemasher/lib-client/asset/encode.js',
      ClientAssetManagerListeners: '@moviemasher/lib-client/asset/manager.js',
      ClientAssetSaveListeners: '@moviemasher/lib-client/asset/save.js',
      ClientAssetTranscodeListeners: '@moviemasher/lib-client/asset/transcode.js',
      ClientAssetUploadListeners: '@moviemasher/lib-client/asset/upload.js',
      ClientAudioListeners: '@moviemasher/lib-client/media.js',
      ClientClipElementListeners: '@moviemasher/lib-client/clip/element.js',
      ClientColorImageListeners: '@moviemasher/lib-client/asset/color/image.js',
      ClientControlAssetListeners: '@moviemasher/lib-client/control/asset.js',
      ClientControlBooleanListeners: '@moviemasher/lib-client/control/boolean.js',
      ClientControlNumericListeners: '@moviemasher/lib-client/control/numeric.js',
      ClientControlRgbListeners: '@moviemasher/lib-client/control/rgb.js',
      ClientControlStringListeners: '@moviemasher/lib-client/control/string.js',
      ClientFontListeners: '@moviemasher/lib-client/media.js',
      ClientGroupAspectListeners: '@moviemasher/lib-client/control/group/aspect.js',
      ClientGroupEncodingListeners: '@moviemasher/lib-client/control/group/encoding.js',
      ClientGroupDimensionsListeners: '@moviemasher/lib-client/control/group/dimensions.js',
      ClientGroupFillListeners: '@moviemasher/lib-client/control/group/fill.js',
      ClientGroupLocationListeners: '@moviemasher/lib-client/control/group/location.js',
      ClientGroupTimeListeners: '@moviemasher/lib-client/control/group/time.js',
      ClientImageListeners: '@moviemasher/lib-client/media.js',
      ClientMashVideoListeners: '@moviemasher/lib-client/asset/mash/video.js',
      ClientRawAudioListeners: '@moviemasher/lib-client/asset/raw/audio.js',
      ClientRawImageListeners: '@moviemasher/lib-client/asset/raw/image.js',
      ClientRawVideoListeners: '@moviemasher/lib-client/asset/raw/video.js',
      ClientShapeImageListeners: '@moviemasher/lib-client/asset/shape/image.js',
      ClientTextImageListeners: '@moviemasher/lib-client/asset/text/image.js',
      ClientVideoListeners: '@moviemasher/lib-client/media.js',
      ClientRawImportListeners: '@moviemasher/lib-client/asset/raw/importer.js',
      ClientTextImportListeners: '@moviemasher/lib-client/asset/text/importer.js',
    },
  },
  get importPromise() { 
    const { options, eventDispatcher } = MovieMasher
    const { imports } = options
    return importPromise(imports, eventDispatcher)
  },
}
