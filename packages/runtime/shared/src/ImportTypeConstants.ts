import type { ImportTypes, FontType } from './ImportType.js'
import { TypesAsset } from './AssetTypeConstants.js'

export const TypeFont: FontType = 'font'

export const TypesImport: ImportTypes = [TypeFont, ...TypesAsset]
