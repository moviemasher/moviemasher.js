import { MediaType } from "@moviemasher/moviemasher.js";

export const imageDefinitionObject = () => ({
  id: 'image', 
  request: { endpoint: { pathname: '../shared/image/globe.jpg' } },
  decodings: [{ width: 320, height: 320 }],
  type: ImageType,
})

