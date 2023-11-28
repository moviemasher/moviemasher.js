import type { AVType } from './AVType.js'
import type { TargetIds } from './Select.js'

import { MASH } from './SourceConstants.js'

export const PREVIEW = 'preview'
export const CUSTOM = 'custom'

export const ASSET_TARGET = 'asset'
export const CLIP_TARGET = 'clip'
export const CONTAINER = 'container'
export const CONTENT = 'content'

export const TARGET_IDS: TargetIds = [
  MASH, CLIP_TARGET, CONTENT, CONTAINER, ASSET_TARGET
]

export const SIZINGS = [PREVIEW, CONTENT, CONTAINER]

export const TIMINGS = [CUSTOM, CONTENT, CONTAINER]


export const CHANGE = 'change'
export const CHANGE_MULTIPLE = 'change-multiple'

export const BOTH: AVType = 'both'
