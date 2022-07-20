import { AudioDefinitionObject } from "../../../packages/moviemasher.js/src/Media/Audio/Audio";
import { DefinitionType } from "../../../packages/moviemasher.js/src/Setup/Enums";

export const audioDefinitionObject = (): AudioDefinitionObject => ({
  id: 'audio', 
  url: '../shared/audio/loop.mp3',
  source: '../shared/audio/loop.mp3',
  type: DefinitionType.Audio,
  duration: 3,
})

