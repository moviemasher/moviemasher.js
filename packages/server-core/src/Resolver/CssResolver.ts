import fs from 'fs'

import { 
  urlFromCss, Resolver, Resolvers, arrayLast, ContentTypeCss, endpointFromUrl, 
  ExtCss, RequestObject 
} from "@moviemasher/moviemasher.js"

const requestPromise = (filePath: string): Promise<RequestObject> => {
  return fs.promises.readFile(filePath).then(buffer => {
    const string = buffer.toString()
    const lastUrl = urlFromCss(string)
    return { endpoint: endpointFromUrl(lastUrl) }
  })
}
const resolver: Resolver = { extension: ExtCss, requestPromise }

Resolvers[ContentTypeCss] = resolver
