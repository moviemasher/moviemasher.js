import type { Importer } from '@moviemasher/runtime-shared'

export interface ClientImporter extends Importer {
  icon: Node
  ui: Node
}

export interface ClientImporters extends Array<ClientImporter>{}