import type { MasherOptions, Masher } from '@moviemasher/runtime-client'
import type { AssetType, MasherType, Plugin } from '@moviemasher/runtime-shared'

export interface MasherPlugin extends Plugin {
  type: MasherType
  masher(options?: MasherOptions): Masher
}

/**
 * @category Plugin
 */
export interface PluginsByMashing extends Record<AssetType | string, MasherPlugin> {}

