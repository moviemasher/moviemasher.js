import { DefinitionType } from "@moviemasher/moviemasher.js";

export const audioDefinitionObject = () => ({
  id: 'audio', 
  request: { endpoint: { pathname: '../shared/audio/loop.mp3' } },
  type: DefinitionType.Audio,
  decodings: [{duration: 3}]
})

