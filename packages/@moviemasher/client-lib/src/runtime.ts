
import { $CHANGE, $CHANGES, $CLIP, $EDIT, $ENCODE, $EVENT, $FRAME, $ICON, $RETRIEVE, $SAVE, $TRANSLATE, $URL, $VIEW, MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { CLIENT_EVENT_IDS } from './module/event.js'
import { VIEW_IDS } from './module/view.js'
import { $INSERT, ADD_TRACK, MOVE_CLIP, REMOVE_CLIP } from './utility/constants.js'

const LIB = '@moviemasher/client-lib'
const MODULE = `${LIB}/module`
const HANDLER = `${LIB}/handler`
const CONTROLS = `${HANDLER}/controls.js`

console.log('client-lib runtime installing modules...')

// install edit modules...
MOVIE_MASHER.installAsync($URL, ['@moviemasher/client-lib/module/retrieve.js', 'urlRetrieveFunction'], $RETRIEVE)
{[$INSERT, ADD_TRACK, $CHANGE, $FRAME, $CHANGES, MOVE_CLIP, REMOVE_CLIP, $EDIT].forEach(key => {
  MOVIE_MASHER.installSync(key, ['@moviemasher/client-lib/module/edit.js', 'editFunction'], $EDIT)
})}

// install event modules...
CLIENT_EVENT_IDS.forEach(id => {
  MOVIE_MASHER.installSync(id, ['@moviemasher/client-lib/module/event.js', 'eventFunction'], $EVENT)
})

// install preview modules 
VIEW_IDS.forEach(id => {
  MOVIE_MASHER.installSync(id, ['@moviemasher/client-lib/module/view.js', `${id}ViewFunction`], $VIEW)
})

MOVIE_MASHER.imports = {
  ClientAssetManagerListeners: `${HANDLER}/manager.js`,

  [$CLIP]: `${LIB}/timeline/timeline-clip.js`,
  ClientAssetElementListeners: `${HANDLER}/element.js`,

  [$ICON]: `${HANDLER}/${$ICON}.js`,
  [$TRANSLATE]: `${HANDLER}/translate.js`,

  // importer modules
  ClientRawImportListeners: `${HANDLER}/raw-importer.js`,
  ClientTextImportListeners: `${HANDLER}/image-text-importer.js`,

  // control modules
  ClientControlAssetListeners: CONTROLS,
  ClientControlBooleanListeners: CONTROLS,
  ClientControlNumericListeners: CONTROLS,
  ClientControlRgbListeners: CONTROLS,
  ClientControlStringListeners: CONTROLS,

  // controlGroupModules
  ClientGroupAspectListeners: CONTROLS,
  ClientGroupDimensionsListeners: CONTROLS,
  ClientGroupFillListeners: CONTROLS,
  ClientGroupLocationListeners: CONTROLS,
  ClientGroupTimeListeners: CONTROLS,

  // actionModules
  [$ENCODE]: `${HANDLER}/encode.js`,
  [$SAVE]: `${MODULE}/save.js`,
}
