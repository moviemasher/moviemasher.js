import { MediaType } from "../Types"
import { modularFalse } from "./with/modularFalse";
import { inaudible } from "./with/inaudible";
import { visible } from "./with/visible";
import { duration } from "./with/duration";
import { urlVisible } from "./with/urlVisible";
import { urlsVisible } from "./with/urlsVisible";
import { sharedMedia } from "./with/sharedMedia";
import { propertiesTiming } from "./with/propertiesTiming";

function ImageMedia(object = {}) { this.object = object }

Object.defineProperties(ImageMedia.prototype, {
  type: { value: MediaType.image },
  ...sharedMedia,
  ...modularFalse,
  ...inaudible,
  ...visible,
  ...duration,
  ...propertiesTiming,
  ...urlVisible,
  ...urlsVisible,
})
      
export { ImageMedia }