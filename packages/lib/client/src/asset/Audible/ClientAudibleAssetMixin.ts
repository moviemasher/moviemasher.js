import type { ClientAsset, ClientAudibleAsset, ClientAudio, ClientAudioNode } from '@moviemasher/runtime-client'
import type { AudibleAsset, Constrained } from '@moviemasher/runtime-shared'
import { AudibleContextInstance } from '../../Client/Mash/Context/AudibleContext.js'


export function ClientAudibleAssetMixin
<T extends Constrained<ClientAsset & AudibleAsset>>(Base: T):
T & Constrained<ClientAudibleAsset> {
  return class extends Base implements ClientAudibleAsset {
    audibleSource(): ClientAudioNode | undefined {
      const { loadedAudio } = this
      if (loadedAudio) {
        // console.log(this.constructor.name, 'audibleSource loadedAudio')
        return AudibleContextInstance.createBufferSource(loadedAudio)
      }
      return 
    }

    loadedAudio?: ClientAudio

    
  }
}
