import { 
  AlphaProbe, AudibleProbe, AudioType, CookedTypes, DecodeOutput, Decoding, 
  DurationProbe, Encoding, Endpoints, ImageType, LoadType, MashMedia, MashType, 
  Media, MediaType, MediaTypes, OrderDecending, PotentialError, ProbeType, 
  RawTypes, Request, SizeProbe, StringRecord, Strings, TranscodeOutput, 
  Transcoding, VideoType 
} from "@moviemasher/moviemasher.js"

export interface DecodeTypesByMediaType extends Record<LoadType, DecodeOutput[]> {}
export interface TranscodingTypesByMediaType extends Record<LoadType, TranscodeOutput[]> {}


export type ReadOperation = 'read'
export type WriteOperation = 'write'
export type TranscodeOperation = 'transcode'
export type EncodeOperation = 'encode'
export type DecodeOperation = 'decode'
export const ReadOperation: ReadOperation = 'read'
export const WriteOperation: WriteOperation = 'write'
export const TranscodeOperation: TranscodeOperation = 'transcode'
export const EncodeOperation: EncodeOperation = 'encode'
export const DecodeOperation: DecodeOperation = 'decode'

export type Operation = ReadOperation | WriteOperation | TranscodeOperation | EncodeOperation | DecodeOperation
export type Operations = Operation[]
export const Operations: Operations = [ReadOperation, WriteOperation, TranscodeOperation, EncodeOperation, DecodeOperation]
export const isOperation = (value: any): value is Operation => {
  return Operations.includes(value)
}


export interface Client {
  accept(options?: ClientSaveOptions): string | undefined
  enabled(operation?: Operation): boolean
  decode(options: ClientDecodeOptions): Promise<Decoding>
  encode(mashMedia: MashMedia, options?: ClientEncodeOptions): Promise<Encoding>
  list(options?: ClientReadOptions): Promise<ClientArrayResponse>
  get(options?: ClientReadOptions): Promise<ClientObjectResponse>

  save(media: Media, options?: ClientSaveOptions): Promise<ClientObjectResponse>
  transcode(options: ClientTranscodeOptions): Promise<Transcoding>
}


export interface ClientDecodeOptions { 
  autoDecode?: DecodeTypesByMediaType | false
}

export interface ClientEncodeOptions {
  autoTranscode?: TranscodingTypesByMediaType | false
}

export interface ClientTranscodeOptions {
  autoTranscode?: TranscodingTypesByMediaType | false
}
export interface ClientReadParams {
  type?: MediaType | MediaTypes
  kind?: string | Strings
  order?: string | StringRecord
}
export interface ClientReadOptions extends ClientReadParams {
  autoGet?: ClientReadParams | false
  getRequest?: Request | false
  listRequest?: Request | false
}

export interface ClientArgs extends Required<ClientOptions> {}

export interface ClientWriteOptions {
  accept?: string | Strings 
  saveRequest?: Request | false
  deleteRequest?: Request | false
  uploadRequest?: Request | false
  uploadResponseIsRequest?: boolean
  uploadCookedTypes?: CookedTypes
}

export interface ClientOptions {
  [ReadOperation]?: ClientReadOptions | false | undefined
  [WriteOperation]?: ClientWriteOptions | false | undefined
  [DecodeOperation]?: ClientDecodeOptions | false | undefined
  [EncodeOperation]?: ClientEncodeOptions | false | undefined
  [TranscodeOperation]?: ClientTranscodeOptions | false | undefined
} 


export const ClientDisabledArgs: ClientArgs = {
  [ReadOperation]: false,
  [WriteOperation]: false,
  [DecodeOperation]: false,
  [EncodeOperation]: false,
  [TranscodeOperation]: false,
}

export const ClientDefaultArgs: ClientArgs = {
  [DecodeOperation]: {
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
  },
  [EncodeOperation]: {

  },
  [ReadOperation]: {
    autoGet: { type: MashType, order: { created_at: OrderDecending }},
    getRequest: { endpoint: { pathname: Endpoints.data.definition.get } }, 
    listRequest: { endpoint: { pathname: Endpoints.data.definition.retrieve } },
      
  },
  [TranscodeOperation]: {
    autoTranscode: {
      [AudioType]: [
        { 
          type: AudioType, 
          options: { outputType: AudioType } 
        }
      ],
    },
  },
  [WriteOperation]: {
    accept: RawTypes.map(type => `${type}/*`),
    saveRequest: { endpoint: { pathname: Endpoints.data.definition.put} }, 
    deleteRequest: { endpoint: { pathname: Endpoints.data.definition.delete } }, 
    uploadRequest: { endpoint: { pathname: Endpoints.data.definition.retrieve } },
    uploadResponseIsRequest: true,
    uploadCookedTypes: [],
  },
}

export interface ClientSaveOptions extends ClientOptions {
  callback?: ClientCallback
}

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


export interface ClientArrayResponse extends PotentialError {
  data?: Media[]
}
export interface ClientObjectResponse extends PotentialError {
  data?: Media
}

export type ClientSaveResponse = ClientArrayResponse | ClientObjectResponse



