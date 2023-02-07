import { Decoding, Decodings, Encoding, Encodings, Media, Medias, TranscodeType, Transcoding, transcodingInstance, Transcodings } from "@moviemasher/moviemasher.js"
import { 
  Client, ClientOptions, DecodeArgs, EncodeArgs, ListDecodingsArgs, ListEncodingsArgs, ListMediaArgs, ListTranscodingsArgs, SaveArgs, TranscodeArgs 
} from "./Client"


export class ClientClass implements Client {
  constructor(public args: ClientOptions) {}
  decodings(args: ListDecodingsArgs): Promise<Decodings> {
    throw new Error("Method not implemented.")
  }
  encodings(args: ListEncodingsArgs): Promise<Encodings> {
    throw new Error("Method not implemented.")
  }
  save(args: SaveArgs): Promise<Media> {
    throw new Error("Method not implemented.")
  }
  transcodings(args: ListTranscodingsArgs): Promise<Transcodings> {
    throw new Error("Method not implemented.")
  }

  decode(args: DecodeArgs): Promise<Decoding> {
    return Promise.resolve({})
  }
  encode(args: EncodeArgs): Promise<Encoding> {
    return Promise.resolve({ id: '', request: { endpoint: {}}})
  }

  media(args: ListMediaArgs): Promise<Medias> {
    return Promise.resolve([])
  }

  transcode(args: TranscodeArgs): Promise<Transcoding> {
    const transcodingobject = { type: TranscodeType.Audio, id: '', request: { endpoint: {}}}
    const transcoding = transcodingInstance(transcodingobject)
    return Promise.resolve(transcoding)
  }
}