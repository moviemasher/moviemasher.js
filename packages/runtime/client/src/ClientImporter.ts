import type { Importer } from '@moviemasher/runtime-shared'

export interface ClientImporter extends Importer {
  icon: Node
  ui: Node
}

export type ClientImporters = ClientImporter[]