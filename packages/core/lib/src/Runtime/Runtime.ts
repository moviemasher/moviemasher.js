
import {DecodePluginsByType} from '../Plugin/Decode/Decode.js'
import {EncodePluginsByType} from '../Plugin/Encode/Encode.js'
import {PluginsByMashing} from '../Plugin/Masher/Masher.js'
import { 
  TypeDecode, TypeEncode, TypeFilter, TypeMasher, 
  TypeResolve, TypeProtocol, TypeTranscode, PluginType, PluginRecord, TypeTheme 
} from '../Plugin/Plugin.js'
import {PluginsByProtocol} from '../Plugin/Protocol/Protocol.js'
import {ResolvePluginsByType} from '../Plugin/Resolve/Resolve.js'
import {ThemePluginsByType} from '../Plugin/Theme/Theme.js'

import {Environment, DefaultEnvironment} from './Environment/Environment.js'



export interface Runtime {
  plugins: Plugins
  environment: Environment
}

export const Runtime: Runtime = {
  environment: DefaultEnvironment,
  plugins: {
    [TypeDecode]: {},
    [TypeEncode]: {},
    [TypeFilter]: {},
    [TypeMasher]: {},
    [TypeProtocol]: {},
    [TypeResolve]: {},
    [TypeTheme]: {},
    [TypeTranscode]: {},
  }
}

export interface Plugins extends Record<PluginType, PluginRecord> {
  [TypeDecode]: DecodePluginsByType
  [TypeEncode]: EncodePluginsByType
  [TypeMasher]: PluginsByMashing
  [TypeProtocol]: PluginsByProtocol
  [TypeResolve]: ResolvePluginsByType,
  [TypeTheme]: ThemePluginsByType
}
