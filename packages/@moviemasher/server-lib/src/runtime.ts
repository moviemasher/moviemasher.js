import { MOVIE_MASHER, $RETRIEVE, $IMAGE, $AUDIO, $VIDEO, $WOFF2, $TTF, $TRANSCODE, $BITMAPS, $WAVEFORM, RAW_TYPES, $ENCODE, $DECODE, $PROBE, $SCAN, $DOM, $WINDOW, $RAW, $MASH } from '@moviemasher/shared-lib/runtime.js'

await MOVIE_MASHER.load($DOM, $WINDOW, '@moviemasher/server-lib/module/dom-window.js', 'domWindow')

{[$PROBE, $SCAN].forEach(type => {
  MOVIE_MASHER.install($DECODE, type, '@moviemasher/server-lib/module/decode.js', 'serverDecodeFunction')
})}

RAW_TYPES.forEach(type => {
  MOVIE_MASHER.install($ENCODE, type, '@moviemasher/server-lib/module/encode.js', 'serverEncodeFunction')
})

{[$AUDIO, $IMAGE, $TTF, $VIDEO, $WOFF2].forEach(type => {
  MOVIE_MASHER.install($RETRIEVE, type, '@moviemasher/server-lib/module/retrieve.js', 'serverRetrieveFunction')
})}

{[$AUDIO, $BITMAPS, $IMAGE, $VIDEO, $WAVEFORM].forEach(type => {
  MOVIE_MASHER.install($TRANSCODE, type, '@moviemasher/server-lib/module/transcode.js', 'serverTranscodeFunction')
})}

MOVIE_MASHER.install($AUDIO, $RAW, '@moviemasher/server-lib/asset/audio-raw.js', 'serverAudioRawAssetFunction')
MOVIE_MASHER.install($IMAGE, $RAW, '@moviemasher/server-lib/asset/image-raw.js', 'serverImageRawAssetFunction')
MOVIE_MASHER.install($VIDEO, $RAW, '@moviemasher/server-lib/asset/video-raw.js', 'serverVideoRawAssetFunction')
MOVIE_MASHER.install($VIDEO, $MASH, '@moviemasher/server-lib/asset/video-mash.js', 'serverVideoMashAssetFunction')

MOVIE_MASHER.imports = {
  // statusModules
  ServerEncodeStatusListeners: '@moviemasher/server-lib/encode/status.js',
  ServerDecodeStatusListeners: '@moviemasher/server-lib/decode/status.js',
  ServerTranscodeStatusListeners: '@moviemasher/server-lib/transcode/status.js',
}
