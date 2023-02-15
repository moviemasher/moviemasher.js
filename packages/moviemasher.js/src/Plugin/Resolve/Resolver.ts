import { Request } from "../../Helpers/Request/Request"
import { ClientAudio, ClientFont, ClientImage, ClientVideo } from "../../ClientMedia/ClientMedia"
import { PathOrError } from "../../Helpers/Error/Error"
import { AudioType, FontType, ImageType, MediaType, VideoType } from "../../Setup/Enums"
import { requestExtension, requestPromise } from "../../Utility/Request"

export type ResolverPromise = {
  (file: string, mimeType: string, type: ImageType): Promise<ClientImage>
  (file: string, mimeType: string, type: AudioType): Promise<ClientAudio>
  (file: string, mimeType: string, type: FontType): Promise<ClientFont>
  (file: string, mimeType: string, type: VideoType): Promise<ClientVideo>
  (file: string, mimeType: string, type?: string): Promise<PathOrError>
}


export interface Resolver {
  requestPromise: (file: string) => Promise<Request>
  extension: string
}

export type ResolverRecord = Record<string, Resolver>

export const Resolvers: ResolverRecord = {}

export const resolverLoad = (mimeType?: string): Resolver | undefined => {
  if (!mimeType) return

  return Resolvers[mimeType]
}

export const resolverPromise = ((file: string, mimeType: string, type?: string): Promise<PathOrError> => {
  const resolver = resolverLoad(mimeType)
  if (resolver) {
    const { requestPromise: resolverRequestPromise } = resolver
    return resolverRequestPromise(file).then(request => requestPromise(request, type))
  }
  const result: PathOrError = { path: file }
  return Promise.resolve(result) 
}) as ResolverPromise

export const resolverPathPromise = (file: string, mimeType?: string): PathOrError | Promise<PathOrError> => {
  const resolver = resolverLoad(mimeType)
  if (resolver) return resolver.requestPromise(file).then(requestPromise)

  return { path: file }
}

export const resolverExtension = (request: Request, mimeType?: string) => {
  const resolver = resolverLoad(mimeType)
  return resolver ? resolver.extension : requestExtension(request) 
}