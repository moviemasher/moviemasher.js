
import { AudioServerBySource, ImageServerBySource, VideoServerBySource } from "../Server/ServerAsset.js"
import {DecodePluginsByType} from '../Plugin/Decode/Decode.js'
import {EncodePluginsByType} from '../Plugin/Encode/Encode.js'
import {PluginsByMashing} from '../Plugin/Masher/Masher.js'
import { 
  
  PluginType, PluginRecord, Source, Constructor 
} from '@moviemasher/runtime-shared'
import {
  TypeDecode, TypeEncode, TypeFilter, TypeMasher,
  TypeProtocol, TypeTranscode
} from "../Plugin/PluginConstants.js"
import {PluginsByProtocol} from '../Plugin/Protocol/Protocol.js'
import { TypeAudio, TypeImage, TypeVideo } from "@moviemasher/runtime-shared"

import {Environment, DefaultEnvironment} from './Environment/Environment.js'
import { ClientAudioAsset, ClientImageAsset, ClientVideoAsset } from "../Client/ClientTypes.js"
import { AudioAssetObject } from "../Shared/Audio/AudioAsset.js"
import { ImageAssetObject } from "../Shared/Image/ImageAsset.js"
import { VideoAssetObject } from "../Shared/Video/VideoAsset.js"

export type AudioClientBySource = Record<Source, Constructor<ClientAudioAsset, AudioAssetObject>>
export type ImageClientBySource = Record<Source, Constructor<ClientImageAsset, ImageAssetObject>>
export type VideoClientBySource = Record<Source, Constructor<ClientVideoAsset, VideoAssetObject>>

interface RuntimeInterface {
  plugins: Plugins
  environment: Environment
  [TypeAudio]: AudioClientBySource
  [TypeImage]: ImageClientBySource
  [TypeVideo]: VideoClientBySource
}

interface ServerRuntimeInterface {
  plugins: Plugins
  environment: Environment
  [TypeAudio]: AudioServerBySource
  [TypeImage]: ImageServerBySource
  [TypeVideo]: VideoServerBySource
}

export const Runtime: RuntimeInterface = {
  [TypeAudio]: {},
  [TypeImage]: {},
  [TypeVideo]: {},
  environment: DefaultEnvironment,
  plugins: {
    [TypeDecode]: {},
    [TypeEncode]: {},
    [TypeFilter]: {},
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
    [TypeFilter]: {},
    [TypeMasher]: {},
    [TypeProtocol]: {},
    [TypeTranscode]: {},
  }
}