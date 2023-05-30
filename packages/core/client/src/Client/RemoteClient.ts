
import type {
  LocalClient, LocalOperation, ClientOperationOptions,
  LocalClientOptions, LocalClientArgs, ClientOperationArgs, 
} from './LocalClient.js'


import type { 
  EndpointRequest,
  DecodeOutput,
  Decoding,
  TranscodeOutput,
  TranscoderOptions,
  Transcoding,
  TranscodingType,
  EncoderOptions,
  Encoding,
  EncodingType,
  MashClientAsset,
  Media,
  PotentialError,
  MediaDataOrError, UploadType 
} from '@moviemasher/lib-core'

import {
  ProbeAlpha,
  ProbeAudible,
  ProbeDuration,
  ProbeSize,
} from '@moviemasher/lib-core' 

import { TypeProbe } from '@moviemasher/lib-core' 
import {
TypeAudio, TypeImage, TypeVideo, 
} from '@moviemasher/lib-core'

import { 
  LocalClientDisabledArgs, DefaultLocalClientArgs, 
} from './LocalClient.js'


// REMOTE CLIENT

export interface RemoteClient extends LocalClient {
  readonly args: RemoteClientArgs

  enabled(operation?: Operation | Operations): boolean

  decode(args: ClientDecodeMethodArgs): Promise<Decoding>
  encode(args: ClientEncodeMethodArgs): Promise<Encoding>
  save(args: ClientSaveMethodArgs): Promise<MediaDataOrError>
  transcode(args: ClientTranscodeMethodArgs): Promise<Transcoding>
}
export const OperationDecode: DecodeOperation = 'decode'
export const OperationEncode: EncodeOperation = 'encode'
export const OperationTranscode: TranscodeOperation = 'transcode'
export const OperationUpload: UploadOperation = 'upload'
export const OperationWrite: WriteOperation = 'write'


export const OperationsRemote: RemoteOperations = [
  OperationDecode,
  OperationEncode, 
  OperationTranscode, 
  OperationUpload,
  OperationWrite, 
]
export const isRemoteOperation = (value: any): value is RemoteOperation => {
  return OperationsRemote.includes(value)
}

export const DefaultClientUploadArgs: ClientUploadArgs = {
  uploadRequest: { endpoint: { pathname: 'data/definition/retrieve' } },
  uploadResponseIsRequest: true,
}
export const DefaultClientWriteArgs: ClientWriteArgs = {
  saveRequest: { endpoint: { pathname: 'data/definition/put'} }, 
  deleteRequest: { endpoint: { pathname: 'data/definition/delete' } }, 
}

export const DefaultClientDecodeArgs: ClientDecodeArgs = {
  autoDecode: {
    [TypeAudio]: [{ 
      type: TypeProbe, 
      options: { types: [ProbeDuration] }
    }],
    [TypeImage]: [{ 
      type: TypeProbe, 
      options: { types: [ProbeAlpha, ProbeSize] }
    }],
    [TypeVideo]: [{ 
      type: TypeProbe, 
      options: { 
        types: [
          ProbeDuration, ProbeSize, 
          ProbeAlpha, ProbeAudible 
        ] 
      }
    }],
  },
}

export const DefaultClientEncodeArgs: ClientEncodeArgs = {
  autoEncode: {}
}
export const DefaultClientTranscodeArgs: ClientTranscodeArgs = {
  autoTranscode: {
    [TypeAudio]: [
      { type: TypeAudio, options: {} }
    ],
  },
}

export const RemoteClientDisabledArgs: RemoteClientArgs = {
  ...LocalClientDisabledArgs,
  [OperationDecode]: false,
  [OperationEncode]: false,
  [OperationTranscode]: false,
  [OperationUpload]: false,
  [OperationWrite]: false,
}

export const DefaultRemoteClientArgs: RemoteClientArgs = {
  ...DefaultLocalClientArgs,
  [OperationDecode]: DefaultClientDecodeArgs,
  [OperationEncode]: DefaultClientEncodeArgs,
  [OperationTranscode]: DefaultClientTranscodeArgs,
  [OperationUpload]: DefaultClientUploadArgs,
  [OperationWrite]: DefaultClientWriteArgs,
}


export type DecodeOperation = 'decode'
export type EncodeOperation = 'encode'
export type TranscodeOperation = 'transcode'
export type UploadOperation = 'upload'
export type WriteOperation = 'write'

export type DecodeOutputsByUploadType = Partial<Record<UploadType, DecodeOutput[]>>

export type TranscodeOutputsByUploadType = Partial<Record<UploadType, TranscodeOutput[]>>

export type RemoteOperation = DecodeOperation | EncodeOperation | TranscodeOperation | UploadOperation | WriteOperation
export type RemoteOperations = RemoteOperation[]
export type Operation = LocalOperation | RemoteOperation
export type Operations = Operation[]



export interface RemoteClientOptions extends LocalClientOptions {
  [OperationDecode]?: ClientDecodeOptions | false | undefined
  [OperationEncode]?: ClientEncodeOptions | false | undefined
  [OperationTranscode]?: ClientTranscodeOptions | false | undefined
  [OperationUpload]?: ClientUploadOptions | false | undefined
  [OperationWrite]?: ClientWriteOptions | false | undefined
} 


export interface ClientMediaCallback {
  media: Media
  callback?: ClientCallback
}

export interface ClientDecodeMethodArgs extends ClientMediaCallback, DecodeOutput {}
export interface ClientEncodeMethodArgs extends ClientMediaCallback {
  type: EncodingType
  options?: EncoderOptions
  media: MashClientAsset
}
export interface ClientTranscodeMethodArgs extends ClientMediaCallback {
  type: TranscodingType 
  options?: TranscoderOptions
}
export interface ClientSaveMethodArgs extends ClientMediaCallback {
  media: MashClientAsset
}


export interface RemoteClientArgs extends LocalClientArgs {
  [OperationDecode]: ClientDecodeArgs | false
  [OperationEncode]: ClientEncodeArgs | false 
  [OperationTranscode]: ClientTranscodeArgs | false
  [OperationUpload]: ClientUploadArgs | false
  [OperationWrite]: ClientWriteArgs | false 
}

export interface ClientDecodeOptions { 
  autoDecode?: DecodeOutputsByUploadType | false
}
export interface ClientDecodeArgs extends ClientOperationArgs, Required<ClientDecodeOptions> {}

export interface ClientEncodeOptions extends ClientOperationOptions {}
export interface ClientEncodeArgs extends ClientOperationArgs, Required<ClientEncodeOptions> {}


export interface ClientTranscodeOptions extends ClientOperationOptions {
  autoTranscode?: TranscodeOutputsByUploadType | false
}

export interface ClientTranscodeArgs extends ClientOperationArgs, Required<ClientTranscodeOptions> {}

export interface ClientUploadOptions extends ClientOperationOptions {
  uploadRequest?: EndpointRequest | false
  uploadResponseIsRequest?: boolean
}
export interface ClientUploadArgs extends ClientOperationArgs, Required<ClientUploadOptions> {}

export interface ClientWriteOptions extends ClientOperationOptions {
  saveRequest?: EndpointRequest | false
  deleteRequest?: EndpointRequest | false
}
export interface ClientWriteArgs extends ClientOperationArgs, Required<ClientWriteOptions> {}

export type ClientWriteAsFile = {
  [index in UploadType]?: boolean
}

export interface ClientProgress extends PotentialError {
  mash?: MashClientAsset
  media: Media
  processing?: Transcoding | Encoding | Decoding
  completed: number
}

export interface ClientProgessSteps extends ClientProgress {
  steps: number
  step: number
}

export type ClientCallback = (progress: ClientProgress) => void



