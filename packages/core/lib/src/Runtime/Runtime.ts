import { DecodePluginsByType } from "../Plugin/Decode/Decode"
import { EncodePluginsByType } from "../Plugin/Encode/Encode"
import { PluginsByMashing } from "../Plugin/Masher/Masher"
import { 
  DecodeType, EncodeType, FilterType, TranslateType, MasherType, 
  ResolveType, ProtocolType, TranscodeType, PluginType, PluginRecord, ThemeType 
} from "../Plugin/Plugin"
import { PluginsByProtocol } from "../Plugin/Protocol/Protocol"
import { ResolvePluginsByType } from "../Plugin/Resolve/Resolve"
import { ThemePluginsByType } from "../Plugin/Theme/Theme"
import { TranslatePluginsByType } from "../Plugin/Translate/Translate"

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
    [MasherType]: {},
    [ProtocolType]: {},
    [ResolveType]: {},
    [ThemeType]: {},
    [TranscodeType]: {},
    [TranslateType]: {},
  }
}

export interface Plugins extends Record<PluginType, PluginRecord> {
  [DecodeType]: DecodePluginsByType
  [EncodeType]: EncodePluginsByType
  [MasherType]: PluginsByMashing
  [ProtocolType]: PluginsByProtocol
  [ResolveType]: ResolvePluginsByType,
  [ThemeType]: ThemePluginsByType
  [TranslateType]: TranslatePluginsByType
}


const foo = Runtime.plugins[MasherType].audio
const bar = Runtime.plugins[ProtocolType].http