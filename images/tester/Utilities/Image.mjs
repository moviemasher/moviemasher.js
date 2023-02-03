import { DefinitionType } from "@moviemasher/moviemasher.js";

export const imageDefinitionObject = () => ({
  id: 'image', 
  url: '../shared/image/globe.jpg',
  source: '../shared/image/globe.jpg',
  previewSize: { width: 320, height: 320 },
  sourceSize: { width: 320, height: 320 },
  type: DefinitionType.Image,
})

