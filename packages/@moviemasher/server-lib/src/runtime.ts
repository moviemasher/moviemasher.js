import { MOVIE_MASHER, $RETRIEVE, $IMAGE, $AUDIO, $VIDEO, $WOFF2, $TTF, $TRANSCODE, $BITMAPS, $WAVEFORM, RAW_TYPES, $ENCODE, $DECODE, $PROBE, $SCAN, $WINDOW, $MASH, $FILE, $WRITE, $READ, $VIEW } from '@moviemasher/shared-lib/runtime.js'
import { JSDOM } from 'jsdom'

export const $COMMAND = 'command' as const

console.log('server-lib runtime installing modules...')

MOVIE_MASHER.installSync($WINDOW, () => {
  console.log($WINDOW)
  const dom = new JSDOM(
    '<html><body></body></html>',
    { runScripts: 'dangerously', resources: 'usable' }
  )
  const { window } = dom
  return window 
})

{[$WRITE, $READ].forEach(type => {
  MOVIE_MASHER.installAsync(type, ['@moviemasher/server-lib/module/file.js', `${type}FileFunction`], $FILE)
})}

MOVIE_MASHER.installSync($MASH, ['@moviemasher/client-lib/module/view.js', 'mashViewFunction'], $VIEW)

{[$PROBE, $SCAN].forEach(type => {
  MOVIE_MASHER.installAsync(type, ['@moviemasher/server-lib/module/decode.js', 'serverDecodeFunction'], $DECODE)
})}

RAW_TYPES.forEach(type => {
  MOVIE_MASHER.installAsync(type, ['@moviemasher/server-lib/module/encode.js', 'serverEncodeFunction'], $ENCODE)
})

{[$AUDIO, $IMAGE, $TTF, $VIDEO, $WOFF2].forEach(type => {
  MOVIE_MASHER.installAsync(type, ['@moviemasher/server-lib/module/retrieve.js', 'serverRetrieveFunction'], $RETRIEVE)
})}

{[$AUDIO, $BITMAPS, $IMAGE, $VIDEO, $WAVEFORM].forEach(type => {
  MOVIE_MASHER.installAsync(type, ['@moviemasher/server-lib/module/transcode.js', 'serverTranscodeFunction'], $TRANSCODE)
})}

MOVIE_MASHER.installAsync($COMMAND, ['@moviemasher/server-lib/module/command.js', 'serverCommandFunction'])

MOVIE_MASHER.imports = {
  // statusModules
  ServerEncodeStatusListeners: '@moviemasher/server-lib/encode/status.js',
  ServerDecodeStatusListeners: '@moviemasher/server-lib/decode/status.js',
  ServerTranscodeStatusListeners: '@moviemasher/server-lib/transcode/status.js',
}
