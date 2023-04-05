
import { 
  JsonRecordType, JsonRecordsType, ErrorName, Runtime, ProtocolType, errorPromise, ImageType, AudioType 
} from "@moviemasher/lib-core"
export const TestProtocol = 'test'
const promise = (request, type) => {
  console.log("TestProtocol", request, type)
  switch(type) {
    case JsonRecordType: {
      const data = { id: 'test-image', type: ImageType, request: { endpoint: { pathname: '../shared/image/globe.jpg' }}}
      return Promise.resolve({data})
    } 
    case JsonRecordsType: {
      const data = [
        { id: 'test-image', type: ImageType, request: { endpoint: { pathname: '../shared/image/globe.jpg' }}},
        { id: 'test-audio', type: AudioType, request: { endpoint: { pathname: '../shared/audio/loop.mp3' }}},
      ]
    }
  }
  return errorPromise(ErrorName.Type, 'TestProtocol not implemented for type', type)
}
Runtime.plugins[ProtocolType][TestProtocol] ||= { promise, type: TestProtocol }


// import path from 'path'
// import { registerFont, loadImage } from "canvas"
// import { TestFilePrefix } from "../Setup/Constants.mjs"
// export class JestPreloader extends BrowserLoaderClass {
//   requestFont(file) {
//     const { urlOrLoaderPath: url } = file
//     const family = this.fontFamily(url)
//     const info = { family }
//     this.updateLoaderFile(file, info)
//     const { document } = globalThis
//     const baseURI = document?.baseURI || 'http://localhost/'
//     const fileUrl = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
//     const pathResolved = path.resolve(TestFilePrefix, fileUrl)
//     // console.log(this.constructor.name, "requestFont", url, pathResolved, family)
//     const object = { family }
//     registerFont(pathResolved, object)
//     return Promise.resolve(object )
//   }

//   requestImage(file){
//     const { urlOrLoaderPath: url } = file
//     const { document } = globalThis
//     const baseURI = document?.baseURI || 'http://localhost/'
    
//     const fileUrl = url.startsWith(baseURI) ? url.slice(baseURI.length) : url
//     const pathResolved = path.resolve(TestFilePrefix, fileUrl)
//     // console.log(this.constructor.name, "requestImage", url, pathResolved)
//     const loadImageResult = loadImage(pathResolved).then((image) => {
//       const { width, height } = image
//       // console.log(this.constructor.name, "requestImage -> loadImage", url, pathResolved, width, height)

//       const info = { width, height }
//       this.updateLoaderFile(file, info)
      
//       return image
//     })
//     return loadImageResult
//   }

//   server = false
// }
