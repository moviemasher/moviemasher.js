import { 
  DecodeType, EncodeType, FilterType, LanguageType, PluginRecord, PluginType, 
  ProtocolType, ResolveType, TranscodeType 
} from "./Plugin"

export interface Plugins extends Record<PluginType, PluginRecord> {}

export const Plugins: Plugins = {
  [DecodeType]: {},
  [EncodeType]: {},
  [FilterType]: {},
  [LanguageType]: {},
  [ProtocolType]: {},
  [ResolveType]: {},
  [TranscodeType]: {},
}
