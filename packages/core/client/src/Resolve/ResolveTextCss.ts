import { 
  AudioType, ClientAudio, ClientFont, ClientImage, ClientMedia, 
  ClientMediaType, ClientVideo, CssMimetype, DataOrError, 
  endpointFromUrl, ErrorName, errorPromise, FontType, ImageType, Request, 
  requestClientMediaPromise, ResolvePlugin, ResolveType, Runtime, urlFromCss, 
  VideoType 
} from "@moviemasher/moviemasher.js";

export const PluginResolveTextCss: ResolvePlugin = {
  mimeType: CssMimetype,
  promise: promise,

  url(file: string, type: ClientMediaType): string {
    switch (type) {
      case FontType: return urlFromCss(file)
    }
    return ''
  },
  type: ResolveType
}

function promise(file: string, type: AudioType): Promise<DataOrError<ClientAudio>>
function promise(file: string, type: FontType): Promise<DataOrError<ClientFont>>
function promise(file: string, type: ImageType): Promise<DataOrError<ClientImage>>
function promise(file: string, type: VideoType): Promise<DataOrError<ClientVideo>>
function promise(file: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> 
function promise(file: string, type: ClientMediaType): Promise<DataOrError<ClientMedia>> {
  const url = PluginResolveTextCss.url(file, type)
  if (!url) return errorPromise(ErrorName.Url)

  const request: Request = { endpoint: endpointFromUrl(url) }
  return requestClientMediaPromise(request, type) 
}

Runtime.plugins[ResolveType][CssMimetype] ||= PluginResolveTextCss