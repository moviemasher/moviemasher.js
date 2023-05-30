import { AssetCacheArgs, PreloadArgs } from '../../Base/Code.js'
import { Size, Time, TimeRange, TypeVideo } from "@moviemasher/runtime-shared"
import { MashClientAssetClass } from "./MashClientClasses.js"
import { ClientVideoAsset } from "../ClientTypes.js"
import { Transcoding } from '../../index.js'


export class MashVideoClientAssetClass extends MashClientAssetClass implements ClientVideoAsset {
  previewTranscoding?: Transcoding | undefined
  audibleSource(): AudioBufferSourceNode | undefined {
    throw new Error('Method not implemented.')
  }
  loadedAudio?: AudioBuffer | undefined
  audio = false
  audioUrl = ''
  frames(quantize: number): number {
    throw new Error('Method not implemented.')
  }
  previewSize?: Size | undefined
  sourceSize?: Size | undefined
  alpha?: boolean | undefined

  
  type = TypeVideo
}
