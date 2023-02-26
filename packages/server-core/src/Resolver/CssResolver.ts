import fs from 'fs'

import { 
  urlFromCss, Resolver, Resolvers, CssContentType, endpointFromUrl, 
  CssExtension, Request 
} from "@moviemasher/moviemasher.js"

const requestPromise = (filePath: string): Promise<Request> => {
  return fs.promises.readFile(filePath).then(buffer => {
    const string = buffer.toString()
    const lastUrl = urlFromCss(string)
    return { endpoint: endpointFromUrl(lastUrl) }
  })
}
const resolver: Resolver = { extension: CssExtension, requestPromise }

Resolvers[CssContentType] = resolver
