import { RequestObject } from "../Api/Api"
import { LoadedAudio, LoadedFont, LoadedImage, LoadedVideo } from "../Load/Loaded"
import { PathOrError } from "../Helpers/Error/Error"
import { AudioType, FontType, ImageType, MediaType, VideoType } from "../Setup/Enums"
import { requestExtension, requestPromise } from "./Request"

export type ResolverPromise = {
  (file: string, mimeType: string, type: ImageType): Promise<LoadedImage>
  (file: string, mimeType: string, type: AudioType): Promise<LoadedAudio>
  (file: string, mimeType: string, type: FontType): Promise<LoadedFont>
  (file: string, mimeType: string, type: VideoType): Promise<LoadedVideo>
  (file: string, mimeType: string, type?: string): Promise<PathOrError>
}


export interface Resolver {
  requestPromise: (file: string) => Promise<RequestObject>
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

export const resolverExtension = (request: RequestObject, mimeType?: string) => {
  const resolver = resolverLoad(mimeType)
  return resolver ? resolver.extension : requestExtension(request) 
}