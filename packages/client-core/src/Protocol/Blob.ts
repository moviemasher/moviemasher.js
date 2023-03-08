import { 
  ProtocolPromise, Request, AudioType, ImageType, VideoType, 
  BlobProtocol, JsonType, PathData, ProtocolType, Runtime, LoadType
} from "@moviemasher/moviemasher.js"
import { audioDataPromise } from "../Utility/Audio"
import { imageDataPromise } from "../Utility/Image"
import { jsonPromise } from "../Utility/Json"
import {  videoDataPromise } from "../Utility/Video"



const promise: ProtocolPromise = ((request: Request, type?: LoadType) => {
  // console.log('blob promise', url, absolute, endpoint)
  switch (type) {
    case AudioType: return audioDataPromise(request)
    case ImageType: return imageDataPromise(request)
    case VideoType: return videoDataPromise(request)
    case JsonType: return jsonPromise(request)
    // case FontType: return requestFontPromise(request)
    // case FontType: return errorThrow(type, 'LoadType', 'type')//fontPromise(url)
    default: {
      const result: PathData = { data: '' }
      return Promise.resolve(result)
    }
  }
}) 

Runtime.plugins[ProtocolType][BlobProtocol] ||= { promise, type: ProtocolType, protocol: BlobProtocol }

