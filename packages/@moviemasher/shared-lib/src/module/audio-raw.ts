import type { AssetCacheArgs, AssetFile, AssetFiles, AssetFunction, AudioInstance, AudioInstanceArgs, AudioInstanceObject, CacheArgs, ClientRawAudioAsset, ClientRawAudioInstance, DataOrError, ServerAudioAsset, ServerInstance, Size } from '../types.js'

import { ClientInstanceClass } from '../base/client-instance.js'
import { ClientRawAssetClass } from '../base/client-raw-asset.js'
import { ServerInstanceClass } from '../base/server-instance.js'
import { ServerRawAssetClass } from '../base/server-raw-asset.js'
import { AudibleAssetMixin, AudibleInstanceMixin } from '../mixin/audible.js'
import { AudioAssetMixin, AudioInstanceMixin } from '../mixin/audio.js'
import { ClientAudibleAssetMixin, ClientAudibleInstanceMixin } from '../mixin/client-audible.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '../mixin/server-audible.js'
import { $ALPHA, $AUDIO, $CLIENT, $RAW, $RETRIEVE, $TRANSCODE, $WAVEFORM, ERROR, MOVIE_MASHER, SLASH, errorPromise, isAssetObject, isDefiniteError, namedError } from '../runtime.js'
import { assertDefined } from '../utility/guards.js'
import { svgColorMask } from '../utility/svg.js'
import { isClientAudio } from '../utility/guard.js'


interface ServerRawAudioAsset extends ServerAudioAsset {}

interface ServerRawAudioInstance extends AudioInstance, ServerInstance {
  asset: ServerRawAudioAsset
}


export class ClientRawAudioAssetClass extends AudioAssetMixin(
  ClientAudibleAssetMixin(AudibleAssetMixin(ClientRawAssetClass))
) implements ClientRawAudioAsset {
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { audible } = args
    if (!audible) return Promise.resolve({ data: 0 })

    const resource = this.resourceOfType($AUDIO) 
    if (!resource) return Promise.resolve({ data: 0 })
    
    return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { response: clientAudio } = resource.request
      if (isClientAudio(clientAudio)) return { data: 1 }
     
      return errorPromise(ERROR.Unimplemented, $AUDIO)
    })
  }

  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    const resource = this.resourceOfType($WAVEFORM) 
    if (!resource) return errorPromise(ERROR.Unavailable, $TRANSCODE)
    
    return this.assetIconPromise(resource, size, false).then(orError => {      
      if (isDefiniteError(orError)) return orError

      const { waveformTransparency = $ALPHA } = MOVIE_MASHER.options
      return { data: svgColorMask(orError.data, size, waveformTransparency) }
    })
  }

  override instanceFromObject(object?: AudioInstanceObject | undefined): AudioInstance {
    return new ClientRawAudioInstanceClass(this.instanceArgs(object))
  }

  override instanceArgs(object: AudioInstanceObject = {}): AudioInstanceArgs {
    const args = super.instanceArgs(object)
    return { ...args, asset: this }
  }
}

export const audioRawAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $AUDIO, $RAW)) {
    return namedError(ERROR.Syntax, [$AUDIO, $RAW].join(SLASH))
  }
  const { context } = MOVIE_MASHER
  const assetClass = context === $CLIENT ? ClientRawAudioAssetClass : ServerRawAudioAssetClass
  return { data: new assetClass(assetObject) }
}

export class ClientRawAudioInstanceClass extends AudioInstanceMixin(
   ClientAudibleInstanceMixin(
    AudibleInstanceMixin(ClientInstanceClass)
   )
) implements ClientRawAudioInstance {
  declare asset: ClientRawAudioAsset
}


export class ServerRawAudioAssetClass extends AudioAssetMixin(
  ServerAudibleAssetMixin(AudibleAssetMixin(ServerRawAssetClass))
) implements ServerRawAudioAsset {
  override assetFiles(args: CacheArgs): AssetFiles {
    const { audible } = args
    if (!audible) return []

    const { request } = this
    if (!request) return []
    
    const { path: file } = request
    assertDefined(file)

    const mutable = this.duration ? this.canBeMuted : true
    if (!mutable) return []
    
    const assetFile: AssetFile = { 
      type: $AUDIO, asset: this, file, avType: $AUDIO 
    }
    return [assetFile]
  }
  override instanceFromObject(object?: AudioInstanceObject): ServerRawAudioInstance {
    const args = this.instanceArgs(object)
    return new ServerRawAudioInstanceClass(args)
  }
}

export const serverAudioRawAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $AUDIO, $RAW)) {
    return namedError(ERROR.Syntax, [$AUDIO, $RAW].join(SLASH))
  }
  console.log('serverAudioRawAssetFunction', assetObject.id)
  return { data: new ServerRawAudioAssetClass(assetObject) }
}


const WithInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerAudibleInstanceMixin(WithInstance)
const WithAudioInstance = AudioInstanceMixin(WithServerInstance)
export class ServerRawAudioInstanceClass extends WithAudioInstance implements ServerRawAudioInstance {
  declare asset: ServerRawAudioAsset
}
