import { 
  ClientAudio, ClientFont, ClientImage, ClientMedia, ClientMediaType, 
  ClientVideo, DataOrError 
} from '../../Helpers/ClientMedia/ClientMedia'
import { AudioType, FontType, ImageType, VideoType } from '../../Setup/Enums'
import { ResolveType, Plugin } from '../Plugin'

export type ResolvePromise = {
  (fileContent: string, type: ImageType):  Promise<DataOrError<ClientImage>>
  (fileContent: string, type: AudioType): Promise<DataOrError<ClientAudio>>
  (fileContent: string, type: FontType): Promise<DataOrError<ClientFont>>
  (fileContent: string, type: VideoType): Promise<DataOrError<ClientVideo>>
  (fileContent: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
}

/**
 * @category Plugin
 */
export interface ResolvePlugin extends Plugin {
  type: ResolveType
  mimeType: string
  promise: ResolvePromise
  url(file: string, type: ClientMediaType): string
}


export type ResolvePluginsByType = Record<string, ResolvePlugin>


