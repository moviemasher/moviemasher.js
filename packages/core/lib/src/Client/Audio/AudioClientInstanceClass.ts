import type { ClientAudibleInstance } from '../ClientTypes.js'

import { AudibleInstanceMixin } from '../../Shared/Audible/AudibleInstanceMixin.js'
import { AudibleClientInstanceMixin } from '../Audible/AudibleClientInstanceMixin.js'
import { ClientInstanceClass } from '../Instance/ClientInstanceClass.js'
import { AudioInstanceMixin } from '../../Shared/Audio/AudioInstanceMixin.js'
import { AudioInstance } from '../../Shared/Audio/AudioInstance.js'

const WithBase = AudibleInstanceMixin(ClientInstanceClass)
const WithAudible = AudibleClientInstanceMixin(WithBase)
const WithAudio = AudioInstanceMixin(WithAudible)
export class AudioClientInstanceClass extends WithAudio implements AudioInstance, ClientAudibleInstance {
  
}


