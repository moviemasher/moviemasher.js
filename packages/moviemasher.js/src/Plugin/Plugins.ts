import { PluginsByProtocol } from "./Protocol/Protocol"
import { PluginsByLanguage } from "./Language/Language"
export interface Plugins {
  protocols: PluginsByProtocol
  languages: PluginsByLanguage
}

export const Plugins: Plugins = {
  protocols: {},
  languages: {},
}