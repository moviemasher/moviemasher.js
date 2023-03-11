import { ClientAudio, ClientFont, ClientImage, ClientMedia, ClientMediaType, ClientVideo, DataOrError } from "../../Helpers/ClientMedia/ClientMedia"
import { AudioType, FontType, ImageType, VideoType } from "../../Setup/Enums"
import { isDefiniteError } from "../../Utility/Is"
import { ResolveType } from "../Plugin"
import { pluginDataOrError } from "../PluginFunctions"

export function resolveMimetypePromise(file: string, mimeType: string, type: AudioType): Promise<DataOrError<ClientAudio>>
export function resolveMimetypePromise(file: string, mimeType: string, type: FontType): Promise<DataOrError<ClientFont>>
export function resolveMimetypePromise(file: string, mimeType: string, type: ImageType): Promise<DataOrError<ClientImage>>
export function resolveMimetypePromise(file: string, mimeType: string, type: VideoType): Promise<DataOrError<ClientVideo>>
export function resolveMimetypePromise(file: string, mimeType: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
export function resolveMimetypePromise(file: string, mimeType: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
{
  const orError = pluginDataOrError(mimeType, ResolveType)
  if (!isDefiniteError(orError)) {
    const { data: plugin } = orError
    return plugin.promise(file, type)
  }
  return Promise.resolve(orError)
}
