import { 
  Media, RequestObject, DecodeType, MediaType, 
  ProbeType, Encoding, Transcoding, Decoding, CookedTypes,
  PotentialError, ImageType, AudioType, VideoType, MashMedia, Endpoints
} from "@moviemasher/moviemasher.js"
import { DecodeTypesByMediaType, TranscodeTypesByMediaType } from "../declarations"

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
  enabled(operation?: Operation): boolean
  decode(args: ClientDecodeOptions): Promise<Decoding>
  encode(args: ClientEncodeOptions): Promise<Encoding>
  media(args: ClientReadOptions): Promise<ClientArrayResponse>
  save(media: Media, args?: ClientSaveOptions): Promise<ClientObjectResponse>
  transcode(args: ClientTranscodeOptions): Promise<Transcoding>
}


export interface ClientDecodeOptions { 
  autoDecode?: DecodeTypesByMediaType | false
}

export interface ClientEncodeOptions {
  autoTranscode?: TranscodeTypesByMediaType | false
}

export interface ClientTranscodeOptions {
  autoTranscode?: TranscodeTypesByMediaType | false
}

export interface ClientReadOptions {
  type?: MediaType
  kind?: string
  getRequest?: RequestObject | false
  listRequest?: RequestObject | false
}

export interface UploadMediaArgs {

}

export interface ClientArgs extends Required<ClientOptions> {}

export interface ClientWriteOptions {

  saveRequest?: RequestObject | false
  deleteRequest?: RequestObject | false
  uploadRequest?: RequestObject | false
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
        type: DecodeType.Probe, 
        options: { types: [ProbeType.Duration] }
      }],
      [ImageType]: [{ 
        type: DecodeType.Probe, 
        options: { types: [ProbeType.Alpha, ProbeType.Size] }
      }],

      [VideoType]: [{ 
        type: DecodeType.Probe, 
        options: { 
          types: [
            ProbeType.Duration, ProbeType.Size, 
            ProbeType.Alpha, ProbeType.Audio 
          ] 
        }
      }],
    },
  },
  [EncodeOperation]: {

  },
  [ReadOperation]: {
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

export type ClientData<T = {}> = T
export type ClientDatum<T = {}> = ClientData<T>[]

export interface ClientResponse<T = {}> extends PotentialError {
  data?: ClientData<T> | ClientDatum<T>
}

export interface ClientArrayResponse extends PotentialError {
  data?: Media[]
}
export interface ClientObjectResponse extends PotentialError {
  data?: Media
}

export type ClientSaveResponse = ClientArrayResponse | ClientObjectResponse



