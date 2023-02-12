import { MediaType } from "@moviemasher/moviemasher.js";

export const audioDefinitionObject = () => ({
  id: 'audio', 
  request: { endpoint: { pathname: '../shared/audio/loop.mp3' } },
  type: AudioType,
  decodings: [{duration: 3}]
})

