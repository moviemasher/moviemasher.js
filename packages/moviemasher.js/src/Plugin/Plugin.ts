
/**
 * @category Plugin
 */
export interface Plugin {
  type: PluginType
}

export type PluginTypeProtocol = 'protocol'
export const PluginTypeProtocol: PluginTypeProtocol = 'protocol'

export type PluginTypeLanguage = 'language'
export const PluginTypeLanguage: PluginTypeLanguage = 'language'


export type PluginTypeProtocols = PluginTypeProtocol[]
export type PluginType = string | PluginTypeProtocol
