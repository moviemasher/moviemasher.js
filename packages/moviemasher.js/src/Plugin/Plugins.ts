import { PluginsByProtocol } from "./Protocol/Protocol"
import { PluginsByLanguage } from "./Language/Language"
import { PluginsByDecoder } from "./Decode/Decoder"

export interface Plugins {
  protocols: PluginsByProtocol
  languages: PluginsByLanguage
  decoders: PluginsByDecoder
  filters: {}
  encoders: {}
  transcoders: {}
  resolvers: {}
}

export const Plugins: Plugins = {
  protocols: {},
  languages: {},
  decoders: {},
  filters: {},
  encoders: {},
  transcoders: {},
  resolvers: {},
}