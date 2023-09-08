import type { ImportTypes, FontType } from './ImportType.js'
import { ASSET_TYPES } from './AssetTypeConstants.js'

export const TypeFont: FontType = 'font'

export const TypesImport: ImportTypes = [TypeFont, ...ASSET_TYPES]
