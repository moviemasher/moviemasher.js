import { 
  ContentTypeJson, Media, Medias, RequestObject, DecodeType, DefinitionType, 
  TranscodeType, OutputType, ProbeType, Encoding, Transcoding, Decoding, 
  Encodings, Decodings, Transcodings, PotentialError
} from "@moviemasher/moviemasher.js"
import { DecodeTypesByDefinitionType, TranscodeTypesByDefinitionType } from "../declarations"


export interface DecodeArgs {
  
}

export interface EncodeArgs {
  
}

export interface TranscodeArgs {
  
}

export interface ListMediaArgs {
  type?: DefinitionType
}

export interface ListDecodingsArgs {
  type?: DefinitionType
}

export interface ListEncodingsArgs {
  type?: DefinitionType
}
export interface ListTranscodingsArgs {
  type?: DefinitionType
}

export interface SaveArgs {
  media: Media | Medias
}

export interface UploadMediaArgs {

}

export interface ClientArgs {
  autoDecode: DecodeTypesByDefinitionType
  autoTranscode: TranscodeTypesByDefinitionType
  listDecodingsRequest: RequestObject
  listEncodingsRequest: RequestObject
  listMediaRequest: RequestObject
  listTranscodingsRequest: RequestObject
  saveMediaRequest: RequestObject
}
export interface ClientOptions extends Partial<ClientArgs> {}

export const ClientDefaultArgs: ClientArgs = {
  autoDecode: {
    [DefinitionType.Audio]: [{ 
      type: DecodeType.Probe, 
      options: { types: [ProbeType.Duration] }
    }],
    [DefinitionType.Image]: [{ 
      type: DecodeType.Probe, 
      options: { types: [ProbeType.Alpha, ProbeType.Size] }
    }],

    [DefinitionType.Video]: [{ 
      type: DecodeType.Probe, 
      options: { 
        types: [
          ProbeType.Duration, ProbeType.Size, 
          ProbeType.Alpha, ProbeType.Audio 
        ] 
      }
    }],
  },
  autoTranscode: {
    [DefinitionType.Audio]: [
      { 
        type: TranscodeType.Audio, 
        options: { outputType: OutputType.Audio } 
      }
    ],
  },
  saveMediaRequest: { endpoint: { pathname: '/media'}, init: { method: 'POST', headers: { 'content-type': ContentTypeJson } }},
  listDecodingsRequest: { endpoint: { pathname: '/decodings' }, init: { method: 'GET' } },
  listEncodingsRequest: { endpoint: { pathname: '/encodings' }, init: { method: 'GET' } },
  listMediaRequest: { endpoint: { pathname: '/media' }, init: { method: 'GET' } },
  listTranscodingsRequest: { endpoint: { pathname: '/transcodings' }, init: { method: 'GET' } },
}

export interface ClientProgress extends PotentialError {
  completed: number
}

export type ClientCallback = () => void
export interface Client {
  decode(args: DecodeArgs): Promise<Decoding>
  decodings(args: ListDecodingsArgs): Promise<Decodings>
  encode(args: EncodeArgs): Promise<Encoding>
  encodings(args: ListEncodingsArgs): Promise<Encodings>
  media(args: ListMediaArgs): Promise<Medias>
  save(args: SaveArgs, callback?: ClientCallback): Promise<Media>
  transcode(args: TranscodeArgs): Promise<Transcoding>
  transcodings(args: ListTranscodingsArgs): Promise<Transcodings>
}


