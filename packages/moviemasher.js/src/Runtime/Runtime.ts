import { DecodePluginsByType, EncodePluginsByType, PluginsByProtocol } from "../Plugin"
import { PluginsByMashing } from "../Plugin/Masher/Masher"
import { 
  DecodeType, EncodeType, FilterType, TranslateType, MasherType, 
  ResolveType, ProtocolType, TranscodeType, PluginType, PluginRecord 
} from "../Plugin/Plugin"

import { Environment, DefaultEnvironment } from "./Environment/Environment"



export interface Runtime {
  plugins: Plugins
  environment: Environment
}

export const Runtime: Runtime = {
  environment: DefaultEnvironment,
  plugins: {
    [DecodeType]: {},
    [EncodeType]: {},
    [FilterType]: {},
    [TranslateType]: {},
    [ProtocolType]: {},
    [ResolveType]: {},
    [TranscodeType]: {},
    [MasherType]: {},
  }
}

export interface Plugins extends Record<PluginType, PluginRecord> {
  [MasherType]: PluginsByMashing
  [ProtocolType]: PluginsByProtocol
  [DecodeType]: DecodePluginsByType
  [EncodeType]: EncodePluginsByType
}


const foo = Runtime.plugins[MasherType].audio
const bar = Runtime.plugins[ProtocolType].http