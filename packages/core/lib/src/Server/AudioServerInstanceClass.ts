import { AudibleInstanceMixin } from '../Shared/Audible/AudibleInstanceMixin.js';
import { AudibleServerInstanceMixin } from "./AudibleServerInstanceMixin.js";
import { AudioInstanceMixin } from '../Shared/Audio/AudioInstanceMixin.js';
import { AudioInstance } from "../Shared/Audio/AudioInstance.js";
import { ServerInstanceClass } from "./ServerInstanceClass.js";

const WithBase = AudibleInstanceMixin(ServerInstanceClass)
const WithAudible = AudibleServerInstanceMixin(WithBase)
const WithAudio = AudioInstanceMixin(WithAudible)
export class AudioServerInstanceClass extends WithAudio implements AudioInstance {
}
