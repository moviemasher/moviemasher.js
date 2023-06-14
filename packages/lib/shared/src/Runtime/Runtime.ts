
import {DecodePluginsByType} from '../Plugin/Decode/Decode.js'
import {EncodePluginsByType} from '../Plugin/Encode/Encode.js'
import {PluginsByMashing} from '../Plugin/Masher/Masher.js'
import { 
  
  PluginType, PluginRecord, Source, Constructor 
} from '@moviemasher/runtime-shared'
import {
  TypeDecode, TypeEncode, TypeMasher,
  TypeProtocol, TypeTranscode
} from "../Plugin/PluginConstants.js"
import {PluginsByProtocol} from '../Plugin/Protocol/Protocol.js'
import { TypeAudio, TypeImage, TypeVideo } from "@moviemasher/runtime-shared"

import {Environment, DefaultEnvironment} from './Environment/Environment.js'
import { ClientAudioAsset, ClientImageAsset, ClientVideoAsset } from "../Client/ClientTypes.js"
import { AudioAssetObject } from "@moviemasher/runtime-shared"
import { ImageAssetObject } from "@moviemasher/runtime-shared"
import { VideoAssetObject } from "@moviemasher/runtime-shared"
import { ServerAudioAsset, ServerImageAsset, ServerVideoAsset } from '../Server/Asset/ServerAssetTypes.js'

export type ClientAudioBySource = Record<Source, Constructor<ClientAudioAsset, AudioAssetObject>>
export type ImageClientBySource = Record<Source, Constructor<ClientImageAsset, ImageAssetObject>>
export type VideoClientBySource = Record<Source, Constructor<ClientVideoAsset, VideoAssetObject>>

export type AudioServerBySource = Record<Source, Constructor<ServerAudioAsset, AudioAssetObject>>
export type ServerImageBySource = Record<Source, Constructor<ServerImageAsset, ImageAssetObject>>
export type ServerVideoBySource = Record<Source, Constructor<ServerVideoAsset, VideoAssetObject>>

export interface RuntimeInterface {
  plugins: Plugins
  environment: Environment
  [TypeAudio]: ClientAudioBySource
  [TypeImage]: ImageClientBySource
  [TypeVideo]: VideoClientBySource
}

export interface ServerRuntimeInterface {
  plugins: Plugins
  environment: Environment
  [TypeAudio]: AudioServerBySource
  [TypeImage]: ServerImageBySource
  [TypeVideo]: ServerVideoBySource
}

export const Runtime: RuntimeInterface = {
  [TypeAudio]: {},
  [TypeImage]: {},
  [TypeVideo]: {},
  environment: DefaultEnvironment,
  plugins: {
    [TypeDecode]: {},
    [TypeEncode]: {},
    [TypeMasher]: {},
    [TypeProtocol]: {},
    [TypeTranscode]: {},
  }
}

export interface Plugins extends Record<PluginType, PluginRecord> {
  [TypeDecode]: DecodePluginsByType
  [TypeEncode]: EncodePluginsByType
  [TypeMasher]: PluginsByMashing
  [TypeProtocol]: PluginsByProtocol
}


export const ServerRuntime: ServerRuntimeInterface = {
  [TypeAudio]: {},
  [TypeImage]: {},
  [TypeVideo]: {}, 
  environment: DefaultEnvironment,
  plugins: {
    [TypeDecode]: {},
    [TypeEncode]: {},
    [TypeMasher]: {},
    [TypeProtocol]: {},
    [TypeTranscode]: {},
  }
}