import type { Labeled } from './Base.js'
import type { Identified } from './Identified.js'

export interface Importer extends Identified, Labeled {}

export type Importers = Importer[]
