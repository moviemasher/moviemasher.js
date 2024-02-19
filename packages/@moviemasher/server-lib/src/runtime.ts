
import { $COLOR, MOVIEMASHER, $RETRIEVE, $IMAGE, $AUDIO, $VIDEO, $WOFF2, $TTF, $TRANSCODE, $BITMAPS, $WAVEFORM, RAW_TYPES, $ENCODE, $DECODE, $PROBE, $SCAN, $TEXT, $RECT, $DOM, $WINDOW } from '@moviemasher/shared-lib/runtime.js'

await MOVIEMASHER.load($DOM, $WINDOW, '@moviemasher/server-lib/module/dom-window.js', 'domWindow')

{[$PROBE, $SCAN].forEach(type => {
  MOVIEMASHER.install($DECODE, type, '@moviemasher/server-lib/module/decode.js', 'serverDecodeFunction')
})}

RAW_TYPES.forEach(type => {
  MOVIEMASHER.install($ENCODE, type, '@moviemasher/server-lib/module/encode.js', 'serverEncodeFunction')
})
// 
{[$AUDIO, $IMAGE, $TTF, $VIDEO, $WOFF2].forEach(type => {
  MOVIEMASHER.install($RETRIEVE, type, '@moviemasher/server-lib/module/retrieve.js', 'serverRetrieveFunction')
})}

{[$AUDIO, $BITMAPS, $IMAGE, $VIDEO, $WAVEFORM].forEach(type => {
  MOVIEMASHER.install($TRANSCODE, type, '@moviemasher/server-lib/module/transcode.js', 'serverTranscodeFunction')
})}

MOVIEMASHER.imports = {
  // manager
  ServerAssetManagerListeners: '@moviemasher/server-lib/asset/manager.js',

  // assetModules
  [$COLOR]: '@moviemasher/server-lib/asset/image-color.js',
  ServerShapeImageListeners: '@moviemasher/server-lib/asset/image-shape.js',
  ServerMashVideoListeners: '@moviemasher/server-lib/asset/video-mash.js',
  ServerRawAudioListeners: '@moviemasher/server-lib/asset/audio-raw.js',
  ServerRawImageListeners: '@moviemasher/server-lib/asset/image-raw.js',
  ServerRawVideoListeners: '@moviemasher/server-lib/asset/video-raw.js',
  ServerTextImageListeners: '@moviemasher/server-lib/asset/image-text.js',

  // statusModules
  ServerEncodeStatusListeners: '@moviemasher/server-lib/encode/status.js',
  ServerDecodeStatusListeners: '@moviemasher/server-lib/decode/status.js',
  ServerTranscodeStatusListeners: '@moviemasher/server-lib/transcode/status.js',
}
