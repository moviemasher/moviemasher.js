import { ImageDefinitionObject } from "../../../packages/moviemasher.js/src/Media/Image/Image";
import { DefinitionType } from "../../../packages/moviemasher.js/src/Setup/Enums";

export const imageDefinitionObject = (): ImageDefinitionObject => ({
  id: 'image', 
  url: '../shared/image/globe.jpg',
  source: '../shared/image/globe.jpg',
  type: DefinitionType.Image,
})

