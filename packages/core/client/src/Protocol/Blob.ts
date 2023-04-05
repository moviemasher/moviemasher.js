import type {
  ProtocolPromise, Request, StringData, LoadType, 
} from '@moviemasher/lib-core'

import { 
  TypeAudio, TypeImage, TypeVideo, 
  ProtocolBlob, TypeProtocol, Runtime, TypeRecord, TypeRecords
} from '@moviemasher/lib-core'
import { audioDataPromise } from '../Utility/Audio.js'
import { imageDataPromise } from '../Utility/Image.js'
import { jsonPromise } from '../Utility/Json.js'
import {  videoDataPromise } from '../Utility/Video.js'



const promise: ProtocolPromise = ((request: Request, type?: LoadType) => {
  // console.log('blob promise', url, absolute, endpoint)
  switch (type) {
    case TypeAudio: return audioDataPromise(request)
    case TypeImage: return imageDataPromise(request)
    case TypeVideo: return videoDataPromise(request)
    case TypeRecord: return jsonPromise(request)
    case TypeRecords: return jsonPromise(request)
    // case FontType: return requestFontPromise(request)
    // case FontType: return errorThrow(type, 'LoadType', 'type')//fontPromise(url)
    default: {
      const result: StringData = { data: '' }
      return Promise.resolve(result)
    }
  }
}) 

Runtime.plugins[TypeProtocol][ProtocolBlob] ||= { promise, type: TypeProtocol, protocol: ProtocolBlob }

