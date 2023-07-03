import type { ImportType } from './ImportType.js'
import type { Importer } from './Importer.js'

import { TypesImport } from './ImportTypeConstants.js'
import { isArray, isPopulatedString } from './TypeofGuards.js'
import { isIdentified } from './IdentifiedGuards.js'

export const isImportType = (value?: any): value is ImportType => (
  TypesImport.includes(value)
)

export const isImporter = (value?: any): value is Importer => (
  isIdentified(value) 
  && 'source' in value && isPopulatedString(value.source)
  && 'types' in value && isArray(value.types)
)