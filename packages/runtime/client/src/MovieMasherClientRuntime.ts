import type { MovieMasherClientRuntime } from './ClientTypes.js'

import { COLOR, importPromise } from '@moviemasher/runtime-shared'
import { ClientEventDispatcher } from './ClientEventDispatcher.js'
import { EventClientEncode, EventClientTranscode, EventSave, EventTranslate } from './ClientEvents.js'

const Controls = '@moviemasher/lib-client/controls.js'
const Raw = '@moviemasher/lib-client/asset/raw.js'

export const MOVIEMASHER: MovieMasherClientRuntime = {
  eventDispatcher: new ClientEventDispatcher(),
  options: {
    imports: {
      [COLOR]: '@moviemasher/lib-client/asset/color/image.js',
      [EventClientEncode.Type]: '@moviemasher/lib-client/asset/encode.js',
      [EventClientTranscode.Type]: '@moviemasher/lib-client/asset/transcode.js',
      [EventSave.Type]: '@moviemasher/lib-client/asset/save.js',
      [EventTranslate.Type]: '@moviemasher/lib-client/translate.js',
      ClientAssetDecodeListeners: '@moviemasher/lib-client/asset/decode.js',
      ClientAssetElementListeners: '@moviemasher/lib-client/asset/element.js',
      ClientAssetManagerListeners: '@moviemasher/lib-client/asset/manager.js',
      ClientAssetUploadListeners: '@moviemasher/lib-client/asset/upload.js',
      ClientAudioListeners: '@moviemasher/lib-client/media.js',
      ClientClipElementListeners: '@moviemasher/lib-client/clip/element.js',
      ClientControlAssetListeners: Controls,
      ClientControlBooleanListeners: Controls,
      ClientControlNumericListeners: Controls,
      ClientControlRgbListeners: Controls,
      ClientControlStringListeners: Controls,
      ClientFontListeners: '@moviemasher/lib-client/media.js',
      ClientGroupAspectListeners: Controls,
      ClientGroupDimensionsListeners: Controls,
      ClientGroupFillListeners: Controls,
      ClientGroupLocationListeners: Controls,
      ClientGroupTimeListeners: Controls,
      ClientIconListeners: '@moviemasher/lib-client/icon/fetch.js',
      ClientImageListeners: '@moviemasher/lib-client/media.js',
      ClientMashVideoListeners: '@moviemasher/lib-client/asset/mash/video.js',
      ClientRawAudioListeners: Raw,
      ClientRawImageListeners: Raw,
      ClientRawVideoListeners: Raw,
      ClientShapeImageListeners: '@moviemasher/lib-client/asset/shape/image.js',
      ClientTextImageListeners: '@moviemasher/lib-client/asset/text/image.js',
      ClientVideoListeners: '@moviemasher/lib-client/media.js',
      ClientRawImportListeners: Raw,
      ClientTextImportListeners: '@moviemasher/lib-client/asset/text/importer.js',
    },
  },
  get importPromise() { 
    const { options, eventDispatcher } = MOVIEMASHER
    const { imports } = options
    return importPromise(imports, eventDispatcher, 'Client')
  },
}
