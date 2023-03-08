import /* type */ {
  TranslateArgs, DecodeOutput, DecoderOptions, Decoding, DecodingType, EncoderOptions, 
  Encoding, EncodingType, Masher, MasherOptions, MashMedia, Media, 
  MediaDataArrayOrError, MediaDataOrError, MediaType, PluginType, PotentialError,
  Request, StringRecord, Strings, TranscodeOutput, TranscoderOptions, 
  Transcoding, TranscodingType, UploadType, PluginDataOrErrorPromiseFunction, PluginDataOrErrorFunction
} from '@moviemasher/moviemasher.js'
import {
  AlphaProbe, assertObject, AudibleProbe, AudioType, DescendingOrder, 
  DurationProbe, EffectType, Emitter, Endpoints, FontType, ImageType, 
  LoadType, MashType, MediaTypes, ProbeType, SizeProbe, VideoType
} from "@moviemasher/moviemasher.js"
import { TranslateFunction, TranslatePromiseFunction } from '../Translate/TranslateFunctions'


export interface Client {
  /**
   * 
   * @returns appropriate accept attribute for file input element
   */
  fileAccept: string
  fileMedia(file: File): Promise<MediaDataOrError>
  decode(args: ClientDecodeMethodArgs): Promise<Decoding>
  enabled(operation?: Operation): boolean
  encode(args: ClientEncodeMethodArgs): Promise<Encoding>
  eventTarget: Emitter
  get(options?: ClientReadParams): Promise<MediaDataOrError>
  list(options?: ClientReadParams): Promise<MediaDataArrayOrError>
  masher(options?: MasherOptions): Masher
  plugin: PluginDataOrErrorFunction
  pluginPromise: PluginDataOrErrorPromiseFunction
  save(args: ClientSaveMethodArgs): Promise<MediaDataOrError>
  transcode(args: ClientTranscodeMethodArgs): Promise<Transcoding>
  translate: TranslateFunction
  translatePromise: TranslatePromiseFunction
}
export interface DecodeTypesByMediaType extends Record<LoadType, DecodeOutput[]> {}

export interface TranscodingTypesByMediaType extends Record<LoadType, TranscodeOutput[]> {}

export type DecodeOperation = 'decode'
export const DecodeOperation: DecodeOperation = 'decode'

export type EncodeOperation = 'encode'
export const EncodeOperation: EncodeOperation = 'encode'

export type ImportOperation = 'import'
export const ImportOperation: ImportOperation = 'import'

export type PluginOperation = 'plugin'
export const PluginOperation: PluginOperation = 'plugin'

export type ReadOperation = 'read'
export const ReadOperation: ReadOperation = 'read'

export type TranscodeOperation = 'transcode'
export const TranscodeOperation: TranscodeOperation = 'transcode'


export type TranslateOperation = 'translate'
export const TranslateOperation: TranslateOperation = 'translate'

export type UploadOperation = 'upload'
export const UploadOperation: UploadOperation = 'upload'

export type WriteOperation = 'write'
export const WriteOperation: WriteOperation = 'write'


export type Operation = DecodeOperation | EncodeOperation | ImportOperation | PluginOperation | ReadOperation | TranscodeOperation | TranslateOperation | UploadOperation | WriteOperation
export type Operations = Operation[]

export type ParamPosition = 'search' | 'body' | 'params'

export interface ClientOptions {
  [PluginOperation]?: ClientPluginOptions | false | undefined
  [DecodeOperation]?: ClientDecodeOptions | false | undefined
  [EncodeOperation]?: ClientEncodeOptions | false | undefined
  [ImportOperation]?: ClientImportOptions | false | undefined
  [ReadOperation]?: ClientReadOptions | false | undefined
  [TranscodeOperation]?: ClientTranscodeOptions | false | undefined
  [TranslateOperation]?: ClientTranslateOptions | false | undefined
  [UploadOperation]?: ClientUploadOptions | false | undefined
  [WriteOperation]?: ClientWriteOptions | false | undefined
} 
export interface ClientMediaCallback {
  media: Media
  callback?: ClientCallback
}

export interface ClientDecodeMethodArgs extends ClientMediaCallback {
  type: DecodingType
  options?: DecoderOptions
}
export interface ClientEncodeMethodArgs extends ClientMediaCallback {
  type: EncodingType
  options?: EncoderOptions
  media: MashMedia
}
export interface ClientPluginMethodArgs extends ClientMediaCallback {
  type: PluginType
  id: string
}

export interface ClientTranscodeMethodArgs extends ClientMediaCallback {
  type: TranscodingType 
  options?: TranscoderOptions
}


export interface ClientSaveMethodArgs extends ClientMediaCallback {
  media: MashMedia
}

export interface ClientArgs {
  [PluginOperation]: ClientPluginOptions | false
  [DecodeOperation]: ClientDecodeArgs | false
  [EncodeOperation]: ClientEncodeArgs | false 
  [ImportOperation]: ClientImportArgs | false
  [ReadOperation]: ClientReadArgs | false 
  [TranscodeOperation]: ClientTranscodeArgs | false
  [TranslateOperation]: ClientTranslateArgs | false
  [UploadOperation]: ClientUploadArgs | false
  [WriteOperation]: ClientWriteArgs | false 
}

export interface ClientDecodeOptions { 
  autoDecode?: DecodeTypesByMediaType | false
}
export interface ClientDecodeArgs extends ClientOperationArgs, Required<ClientDecodeOptions> {}

export interface ClientEncodeOptions extends ClientOperationOptions {
  
}
export interface ClientEncodeArgs extends ClientOperationArgs, Required<ClientEncodeOptions> {}

export interface ClientImportOptions extends ClientOperationOptions {
  uploadLimits?: ClientLimits | false
  
}
export interface ClientImportArgs extends ClientOperationArgs, Required<ClientImportOptions> {}

export interface ClientPluginOptions extends ClientOperationOptions {
  request?: Request | false
}
export interface ClientPluginArgs extends ClientOperationArgs, Required<ClientPluginOptions> {}

export interface ClientReadOptions extends ClientOperationOptions {
  autoGet?: ClientReadParams | false
  paramPosition: ParamPosition
  getRequest?: Request | false
  listRequest?: Request | false
}
export interface ClientReadArgs extends ClientOperationArgs, Required<ClientReadOptions> {}

export interface ClientTranscodeOptions extends ClientOperationOptions {
  autoTranscode?: TranscodingTypesByMediaType | false
}

export interface ClientTranslateOptions extends ClientOperationOptions {
  defaultLocale?: string
  locale?: string
  autoFetch?: boolean
}
export interface ClientTranscodeArgs extends ClientOperationArgs, Required<ClientTranscodeOptions> {}

export interface ClientTranslateArgs extends ClientOperationArgs, Required<ClientTranslateOptions> {}

export interface ClientUploadOptions extends ClientOperationOptions {

  uploadRequest?: Request | false
  uploadResponseIsRequest?: boolean
}
export interface ClientUploadArgs extends ClientOperationArgs, Required<ClientUploadOptions> {}

export interface ClientWriteOptions extends ClientOperationOptions {
  saveRequest?: Request | false
  deleteRequest?: Request | false
}
export interface ClientWriteArgs extends ClientOperationArgs, Required<ClientWriteOptions> {}

export type ClientWriteAsFile = {
  [index in UploadType]?: boolean
}
export type ClientLimits = {
  [index in UploadType]?: number
}


export interface ClientReadParams {
  type?: MediaType | MediaTypes
  kind?: string | Strings
  order?: string | StringRecord
  offset?: number
  index?: number
  count?: number
}
export interface ClientOperationOptions {}

export interface ClientOperationArgs {}


export interface ClientProgress extends PotentialError {
  mash?: MashMedia
  media: Media
  processing?: Transcoding | Encoding | Decoding
  completed: number
}

export interface ClientProgessSteps extends ClientProgress {
  steps: number
  step: number
}

export type ClientCallback = (progress: ClientProgress) => void

export const Operations: Operations = [
  DecodeOperation,
  EncodeOperation, 
  ImportOperation,
  ReadOperation, 
  TranscodeOperation, 
  UploadOperation,
  WriteOperation, 
]


export const DefaultClientLimits: ClientLimits = {
  [AudioType]: 50,
  [EffectType]: 1,
  [FontType]: 10,
  [ImageType]: 20,
  [MashType]: 5,
  [VideoType]: 100,
}
export const DefaultClientImportArgs: ClientImportArgs = {
  uploadLimits: DefaultClientLimits,
}

export const DefaultClientPluginArgs: ClientPluginArgs = {
  request: { endpoint: {} },
}

export const DefaultClientTranslateArgs: ClientTranslateArgs = {
  defaultLocale: 'en',
  locale: '',
  autoFetch: true,
}

export const DefaultClientUploadArgs: ClientUploadArgs = {
  uploadRequest: { endpoint: { pathname: Endpoints.data.definition.retrieve } },
  uploadResponseIsRequest: true,
}
export const DefaultClientWriteArgs: ClientWriteArgs = {
  saveRequest: { endpoint: { pathname: Endpoints.data.definition.put} }, 
  deleteRequest: { endpoint: { pathname: Endpoints.data.definition.delete } }, 
}


export const ClientDisabledArgs: ClientArgs = {
  [DecodeOperation]: false,
  [EncodeOperation]: false,
  [ImportOperation]: DefaultClientImportArgs,
  [PluginOperation]: DefaultClientPluginArgs,
  [ReadOperation]: false,
  [TranscodeOperation]: false,
  [TranslateOperation]: DefaultClientTranslateArgs,
  [UploadOperation]: false,
  [WriteOperation]: false,
}


export const DefaultClientDecodeArgs: ClientDecodeArgs = {
  autoDecode: {
    [AudioType]: [{ 
      type: ProbeType, 
      options: { types: [DurationProbe] }
    }],
    [ImageType]: [{ 
      type: ProbeType, 
      options: { types: [AlphaProbe, SizeProbe] }
    }],
    [VideoType]: [{ 
      type: ProbeType, 
      options: { 
        types: [
          DurationProbe, SizeProbe, 
          AlphaProbe, AudibleProbe 
        ] 
      }
    }],
  },
}

export const DefaultClientReadArgs: ClientReadArgs = {
  paramPosition: 'search',
  autoGet: { type: MashType, order: { created_at: DescendingOrder } },
  getRequest: { endpoint: { pathname: Endpoints.data.definition.get } },
  listRequest: { endpoint: { pathname: Endpoints.data.definition.retrieve } },
}

export const DefaultClientEncodeArgs: ClientEncodeArgs = {
  autoEncode: {}
}
export const DefaultClientTranscodeArgs: ClientTranscodeArgs = {
  autoTranscode: {
    [AudioType]: [
      { 
        type: AudioType, 
        options: { outputType: AudioType } 
      }
    ],
  },
}


export const DefaultClientArgs: ClientArgs = {
  [DecodeOperation]: DefaultClientDecodeArgs,
  [EncodeOperation]: DefaultClientEncodeArgs,
  [ImportOperation]: DefaultClientImportArgs,
  [PluginOperation]: DefaultClientPluginArgs,
  [ReadOperation]: DefaultClientReadArgs,
  [TranscodeOperation]: DefaultClientTranscodeArgs,
  [TranslateOperation]: DefaultClientTranslateArgs,
  [UploadOperation]: DefaultClientUploadArgs,
  [WriteOperation]: DefaultClientWriteArgs,
}


export const isOperation = (value: any): value is Operation => {
  return Operations.includes(value)
}

export const clientArgs = (options: ClientOptions = {}): ClientArgs => {
  function clientOperationArgs(operation: DecodeOperation, options: ClientOptions): ClientDecodeArgs | false
  function clientOperationArgs(operation: EncodeOperation, options: ClientOptions): ClientEncodeArgs | false
  function clientOperationArgs(operation: ImportOperation, options: ClientOptions): ClientImportArgs | false
  function clientOperationArgs(operation: PluginOperation, options: ClientOptions): ClientPluginArgs | false
  function clientOperationArgs(operation: ReadOperation, options: ClientOptions): ClientReadArgs | false
  function clientOperationArgs(operation: TranscodeOperation, options: ClientOptions): ClientTranscodeArgs | false
  function clientOperationArgs(operation: TranslateOperation, options: ClientOptions): ClientTranslateArgs | false
  function clientOperationArgs(operation: UploadOperation, options: ClientOptions): ClientUploadArgs | false
  function clientOperationArgs(operation: WriteOperation, options: ClientOptions): ClientWriteArgs | false
  function clientOperationArgs(operation: Operation, options: ClientOptions): ClientOperationArgs | false {
    const { [operation]: clientOptions = {}} = options
    if (clientOptions === false) return clientOptions

    const { [operation]: defaultClientArg } = DefaultClientArgs
    assertObject(defaultClientArg)

    return { ...defaultClientArg, ...clientOptions }
  }
  return {
    [DecodeOperation]: clientOperationArgs(DecodeOperation, options),
    [EncodeOperation]: clientOperationArgs(EncodeOperation, options),
    [ImportOperation]: clientOperationArgs(ImportOperation, options),
    [PluginOperation]: clientOperationArgs(PluginOperation, options),
    [ReadOperation]: clientOperationArgs(ReadOperation, options),
    [TranscodeOperation]: clientOperationArgs(TranscodeOperation, options),
    [TranslateOperation]: clientOperationArgs(TranslateOperation, options),
    [UploadOperation]: clientOperationArgs(UploadOperation, options),
    [WriteOperation]: clientOperationArgs(WriteOperation, options),
  }
}
