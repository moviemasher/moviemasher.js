import type { ImportTypes, FontType } from './ImportType.js'
import { ASSET_TYPES } from './AssetTypeConstants.js'

export const FONT: FontType = 'font'

export const IMPORT_TYPES: ImportTypes = [FONT, ...ASSET_TYPES]
